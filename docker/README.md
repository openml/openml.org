# openml frontend

The frontend for OpenML.

## Usage

The easiest way to use the OpenML image is using [Openml Services](https://github.com/openml/services).

Alternatively, run the container directly using

```bash
docker run --rm -d -p 5000:5000 --name openml-frontend openml/frontend:env_[version]
docker kill openml-frontend  # the container doesn't seem to respond to a friendly stop request
```

## Build and publish

For local development using docker compose (openml services):

```bash
docker build -f docker/Dockerfile --tag openml/frontend:dev_[version] .
docker push openml/frontend:dev_[version]
```

For production on kubernetes:

```bash
docker build -f docker/Dockerfile --tag openml/frontend:k8s_[version] --build-arg environment=.k8s .
docker push openml/frontend:k8s_[version]
```

Similarly, builds can be made for other environments.
