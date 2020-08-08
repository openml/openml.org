#!/bin/bash
npm run build --prefix server/src/client/app/
gunicorn --workers=4 --certfile /etc/apache2/ssl/openml_org.crt --keyfile /etc/apache2/ssl/openml_org.key -b localhost:5000 autoapp:app --access-logfile '-'
