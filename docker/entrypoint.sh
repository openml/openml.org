#!/bin/bash

for FILENAME in /app/server/src/client/app/build/static/js/*.js; do
	# We expect some paths/urls to contain '/' characters, so we use '*' instead
	sed "s*<REACT_APP_URL_SITE_BACKEND>*${REACT_APP_URL_SITE_BACKEND:-http://localhost:8000/}*g" --in-place ${FILENAME}
	sed "s*<REACT_APP_URL_API>*${REACT_APP_URL_API:-http://localhost:8000/api/}*g" --in-place ${FILENAME}
	sed "s*<REACT_APP_URL_ELASTICSEARCH>*${REACT_APP_URL_ELASTICSEARCH:-http://localhost:8000/es/}*g" --in-place ${FILENAME}
	sed "s*<REACT_APP_ELASTICSEARCH_VERSION_MAYOR>*${REACT_APP_ELASTICSEARCH_VERSION_MAYOR:-6}*g" --in-place ${FILENAME}
	sed "s*<REACT_APP_URL_MINIO>*${REACT_APP_URL_MINIO:-http://localhost:8000/data/}*g" --in-place ${FILENAME}
done

sudo su unprivileged-user
gunicorn -b 0.0.0.0:5000 autoapp:app --chdir /app
