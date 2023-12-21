# openml frontend

## Usage

```bash
docker run --rm -d -p 5000:5000 --name openml-frontend openml/frontend
docker kill openml-frontend  # the container doesn't seem to respond to a friendly stop request
```

To configure, you can add environment variables. See .flaskenv for the envirnoment variables. To add 
the environment variables to docker, you can use `--env-file`:
```bash
docker run --rm -d -p 5000:5000 --name openml-frontend --env-file .env openml/frontend
```

## Build and publish
```bash
docker build -f docker/Dockerfile --tag openml/frontend:latest .
docker push openml/frontend:latest
```
