#!/bin/bash

gunicorn -b 0.0.0.0:5000 autoapp:app \
    --chdir /app \
    --access-logfile /home/unprivileged-user/access.log \
    --error-logfile /home/unprivileged-user/error.log
