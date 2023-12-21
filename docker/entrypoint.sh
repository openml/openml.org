#!/bin/bash

gunicorn -b 0.0.0.0:5000 autoapp:app --chdir /app
