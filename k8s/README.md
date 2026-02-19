# OpenML Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the OpenML Flask backend to both development and production environments using a **single Docker image**.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Single Docker Image                       │
│                  openml-flask:v1.0.0                         │
│                                                               │
│  Adapts behavior based on ENVIRONMENT variable:              │
│  - development: 1 worker, debug logs, test server           │
│  - production: 4 workers, warning logs, prod server          │
└─────────────────────────────────────────────────────────────┘
                    │                    │
                    │                    │
         ┌──────────▼──────────┐  ┌─────▼──────────┐
         │  Development K8s     │  │ Production K8s │
         │  namespace:          │  │ namespace:     │
         │  openml-dev          │  │ openml-prod    │
         │                      │  │                │
         │  • 1 replica         │  │ • 3 replicas   │
         │  • SQLite DB         │  │ • MySQL DB     │
         │  • Test OpenML API   │  │ • Prod API     │
         │  • Low resources     │  │ • HPA enabled  │
         └──────────────────────┘  └────────────────┘
```

## Directory Structure

```
k8s/
├── README.md                       # This file
├── namespaces.yaml                 # Creates openml-dev and openml-prod namespaces
├── dev/
│   ├── configmap.yaml              # Development configuration
│   ├── secrets.yaml                # Development secrets (safe for git)
│   └── deployment.yaml             # Development deployment + service
└── prod/
    ├── configmap.yaml              # Production configuration
    ├── secrets.yaml.template       # Production secrets template (DO NOT commit with real values)
    └── deployment.yaml             # Production deployment + service + HPA
```

## Prerequisites

1. **Kubernetes cluster** (1.19+)
2. **kubectl** configured to access your cluster
3. **Docker image** built and pushed to registry:
    ```bash
    docker build -t your-registry/openml-flask:v1.0.0 -f docker/Dockerfile .
    docker push your-registry/openml-flask:v1.0.0
    ```

## Quick Start

### 1. Create Namespaces

```bash
kubectl apply -f k8s/namespaces.yaml
```

Verify:

```bash
kubectl get namespaces | grep openml
```

### 2. Deploy to Development

```bash
# Create secrets
kubectl apply -f k8s/dev/secrets.yaml

# Create config
kubectl apply -f k8s/dev/configmap.yaml

# Deploy application
kubectl apply -f k8s/dev/deployment.yaml
```

Verify deployment:

```bash
kubectl get pods -n openml-dev
kubectl logs -n openml-dev -l app=openml-backend --tail=50
```

Test the service:

```bash
kubectl port-forward -n openml-dev svc/openml-backend-dev 8000:80
curl http://localhost:8000/health
```

### 3. Deploy to Production

**Important:** Create production secrets securely (see [Production Secrets](#production-secrets))

```bash
# Create secrets (see Production Secrets section below)
kubectl create secret generic openml-backend-prod-secrets \
  --from-literal=APP_SECRET_KEY=$(openssl rand -hex 32) \
  --from-literal=JWT_SECRET_KEY=$(openssl rand -hex 32) \
  --from-literal=SMTP_PASS=your-smtp-password \
  --from-literal=DATABASE_URI=mysql://user:pass@mysql-host/openml \
  --namespace openml-prod

# Create config
kubectl apply -f k8s/prod/configmap.yaml

# Update deployment with your image
sed -i '' 's|your-registry/openml-flask:v1.0.0|your-actual-registry/openml-flask:v1.0.0|' k8s/prod/deployment.yaml

# Deploy application
kubectl apply -f k8s/prod/deployment.yaml
```

Verify production deployment:

```bash
kubectl get pods -n openml-prod
kubectl get hpa -n openml-prod
kubectl logs -n openml-prod -l app=openml-backend --tail=50
```

## Configuration

### Environment Variables

The application behavior is controlled by the `ENVIRONMENT` variable:

| Variable           | Development   | Production   |
| ------------------ | ------------- | ------------ |
| `ENVIRONMENT`      | `development` | `production` |
| `FLASK_ENV`        | `development` | `production` |
| `TESTING`          | `True`        | `False`      |
| `LOG_LEVEL`        | `DEBUG`       | `WARNING`    |
| `GUNICORN_WORKERS` | `1`           | `4`          |
| `DATABASE_URI`     | SQLite        | MySQL        |

### Updating Configuration

**Development:**

```bash
kubectl edit configmap openml-backend-dev-config -n openml-dev
# Restart pods to pick up changes
kubectl rollout restart deployment/openml-backend-dev -n openml-dev
```

**Production:**

```bash
kubectl edit configmap openml-backend-prod-config -n openml-prod
# Rolling restart (zero downtime)
kubectl rollout restart deployment/openml-backend-prod -n openml-prod
```

## Secrets Management

### Development Secrets

Development secrets are safe to commit (they're for local testing only):

```bash
kubectl apply -f k8s/dev/secrets.yaml
```

### Production Secrets

**Never commit production secrets to git!**

#### Option 1: Create from Command Line

```bash
kubectl create secret generic openml-backend-prod-secrets \
  --from-literal=APP_SECRET_KEY=$(openssl rand -hex 32) \
  --from-literal=JWT_SECRET_KEY=$(openssl rand -hex 32) \
  --from-literal=SMTP_PASS=your-smtp-password \
  --from-literal=DATABASE_URI='mysql://user:password@mysql-host:3306/openml?charset=utf8mb4' \
  --namespace openml-prod
```

#### Option 2: Use External Secrets Operator

For production, consider using [External Secrets Operator](https://external-secrets.io/):

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
    name: openml-backend-prod-secrets
    namespace: openml-prod
spec:
    refreshInterval: 1h
    secretStoreRef:
        name: aws-secrets-manager
        kind: SecretStore
    target:
        name: openml-backend-prod-secrets
    data:
        - secretKey: APP_SECRET_KEY
          remoteRef:
              key: openml/prod/app-secret-key
        - secretKey: DATABASE_URI
          remoteRef:
              key: openml/prod/database-uri
```

#### Option 3: Use Sealed Secrets

[Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) allows you to encrypt secrets that can be safely committed to git:

```bash
# Install sealed-secrets controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.18.0/controller.yaml

# Create and seal a secret
echo -n "my-secret-value" | kubectl create secret generic my-secret \
  --dry-run=client --from-file=password=/dev/stdin -o json | \
  kubeseal -o yaml > sealed-secret.yaml

# Commit sealed-secret.yaml to git (safe!)
kubectl apply -f sealed-secret.yaml
```

## Monitoring and Validation

### Check Deployment Status

```bash
# Development
kubectl get all -n openml-dev

# Production
kubectl get all -n openml-prod
```

### View Logs

```bash
# All pods in namespace
kubectl logs -n openml-dev -l app=openml-backend --tail=100 --follow

# Specific pod
kubectl logs -n openml-prod openml-backend-prod-xxxxx-yyyyy --follow
```

### Check Health

```bash
# Port forward to service
kubectl port-forward -n openml-prod svc/openml-backend-prod 8000:80

# Test health endpoint
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/datasets/61/stats
```

### Monitor Autoscaling (Production)

```bash
kubectl get hpa -n openml-prod --watch
kubectl describe hpa openml-backend-prod-hpa -n openml-prod
```

## Troubleshooting

### Pod Not Starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n openml-dev

# Check logs
kubectl logs <pod-name> -n openml-dev

# Common issues:
# - Image pull errors: Update image in deployment.yaml
# - Secret not found: Create secrets first
# - ConfigMap not found: Apply configmap.yaml
```

### Database Connection Issues

Production pods might fail if MySQL is not configured:

```bash
# Check database secret
kubectl get secret openml-backend-prod-secrets -n openml-prod -o yaml

# Verify DATABASE_URI is correctly set
kubectl get secret openml-backend-prod-secrets -n openml-prod \
  -o jsonpath='{.data.DATABASE_URI}' | base64 -d
```

### Health Check Failures

```bash
# Check if /health endpoint exists
kubectl exec -it <pod-name> -n openml-dev -- curl localhost:5000/health

# If missing, comment out health checks temporarily:
kubectl edit deployment openml-backend-dev -n openml-dev
```

## Updating the Application

### Deploy New Version

1. Build and push new image:

    ```bash
    docker build -t your-registry/openml-flask:v1.1.0 -f docker/Dockerfile .
    docker push your-registry/openml-flask:v1.1.0
    ```

2. Update deployment:

    ```bash
    kubectl set image deployment/openml-backend-prod \
      flask=your-registry/openml-flask:v1.1.0 \
      -n openml-prod
    ```

3. Monitor rollout:
    ```bash
    kubectl rollout status deployment/openml-backend-prod -n openml-prod
    ```

### Rollback if Needed

```bash
kubectl rollout undo deployment/openml-backend-prod -n openml-prod
kubectl rollout history deployment/openml-backend-prod -n openml-prod
```

## Resource Limits

### Development

- CPU: 250m request, 1 core limit
- Memory: 512Mi request, 2Gi limit
- Replicas: 1

### Production

- CPU: 1 core request, 4 cores limit
- Memory: 2Gi request, 8Gi limit
- Replicas: 3-10 (autoscaling)

Adjust resources based on your needs:

```bash
kubectl edit deployment openml-backend-prod -n openml-prod
```

## Cost Optimization

### Development

- Uses minimal resources
- Single replica
- Can be scheduled on spot/preemptible instances

### Production

- Uses horizontal pod autoscaling (HPA)
- Scales down during low traffic
- Consider cluster autoscaling for cost savings

## Security Best Practices

1. **Never commit secrets** to git
2. **Use RBAC** to limit access to namespaces
3. **Enable network policies** to restrict traffic
4. **Use Pod Security Standards**
5. **Scan images** for vulnerabilities
6. **Rotate secrets** regularly
7. **Use service accounts** with minimal permissions

## Next Steps

1. **Set up Ingress** for external access:

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
        name: openml-backend-prod
        namespace: openml-prod
    spec:
        rules:
            - host: api.openml.org
              http:
                  paths:
                      - path: /
                        pathType: Prefix
                        backend:
                            service:
                                name: openml-backend-prod
                                port:
                                    number: 80
    ```

2. **Set up monitoring** (Prometheus + Grafana)

3. **Configure log aggregation** (ELK/Loki)

4. **Set up CI/CD** pipeline for automated deployments

5. **Configure backups** for persistent data

## Reference

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Entrypoint](../docker/entrypoint.sh) - Shows environment detection logic
- [Flask Application](../autoapp.py)
- [Stats API Architecture](../app-next/docs/STATS_API_ARCHITECTURE.md)

## Support

For issues or questions:

- Check logs: `kubectl logs -n openml-<env> -l app=openml-backend`
- Check events: `kubectl get events -n openml-<env> --sort-by='.lastTimestamp'`
- Describe resources: `kubectl describe deployment openml-backend-<env> -n openml-<env>`
