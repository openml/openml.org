FROM node:22.11.0-slim AS build
ARG environment=.dev
COPY ./ /app

RUN npm install --prefix /app/server/src/client/app
RUN /app/server/src/client/app/node_modules/.bin/env-cmd -f /app/.env${environment} npm run build --prefix /app/server/src/client/app



FROM python:3.11-slim-bookworm

RUN apt update && apt upgrade -y
RUN python -m pip install --upgrade pip

COPY . /app
WORKDIR /app
RUN python -m pip install -r requirements.txt

RUN useradd --create-home unprivileged-user
USER unprivileged-user

COPY --from=build /app/server/src/client/app/build /app/server/src/client/app/build

EXPOSE 5000
ENTRYPOINT ["sh", "docker/entrypoint.sh"]
