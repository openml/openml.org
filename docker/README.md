# openml frontend

## Usage

```bash
docker run --rm -d -p 5000:5000 --name openml-frontend --env-file .env openml/frontend:current
docker kill openml-frontend  # the container doesn't seem to respond to a friendly stop request
```

For the k8s deployment, use:
```bash
docker run --rm -d -p 5000:5000 --name openml-frontend --env-file .env.k8s openml/frontend:k8s
docker kill openml-frontend  # the container doesn't seem to respond to a friendly stop request
```

## Build and publish

Currently, you need to manually run the `npm run build` before a docker build. We should put 
that step inside the docker build step. I didn't do that yet, because this is a minor 
inconvenience, and I think we might want to refactor the build/deployment process a bit anyway 
(do we want to separate the frontend and this backend into separate containers? Do we want to 
merge the backend and the api-backend-server?).

For current production:
```bash
./server/src/client/app/node_modules/.bin/env-cmd -f ./.env npm run build --prefix server/src/client/app/
docker build -f docker/Dockerfile --tag openml/frontend:latest .
docker push openml/frontend:latest
```

For k8s:
```bash
./server/src/client/app/node_modules/.bin/env-cmd -f ./.env.k8s npm run build --prefix server/src/client/app/
docker build -f docker/Dockerfile --tag openml/frontend:k8s .
docker push openml/frontend:k8s
```