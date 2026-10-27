# openml frontend

The new frontend for OpenML. The preview is available at `beta.openml.org`.

## Usage

The easiest way to use the OpenML image is using [Openml Services](https://github.com/openml/services).


Alternatively, run the container directly using

```bash
docker run --rm -d -p 5000:5000 --name openml-frontend openml/frontend:env_[version]
docker kill openml-frontend  # the container doesn't seem to respond to a friendly stop request
```

## Configuration

Copy the `.env.docker.example` file to `.env.docker` and update the values as necessary.
For an example configuration that works with `services` setup, see the `.env.services.example` file in the `app-next` directory.


## Build

For local development using docker compose (openml services), run from the `app-next` directory containing the `Dockerfile`:
```bash
docker build -f Dockerfile --tag openml/frontend:dev_[version] .
```

## Publish
Publishing the NextJS image goes through a GitHub workflow which can only be triggered from the GitHub Actions menu for users with the right permissions.

