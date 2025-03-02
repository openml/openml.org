#!/bin/bash
echo "Please run manually as root"
exit 0

./server/src/client/app/node_modules/.bin/env-cmd -f ./.env npm run build --prefix server/src/client/app/
systemctl restart gunicorn
~
