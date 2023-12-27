FROM python:3.8-slim-bookworm

RUN apt update && apt upgrade -y
RUN python -m pip install --upgrade pip

COPY . /app
WORKDIR /app
RUN python -m pip install -r requirements.txt

RUN useradd --create-home unprivileged-user
USER unprivileged-user

EXPOSE 5000
ENTRYPOINT ["sh", "docker/entrypoint.sh"]
