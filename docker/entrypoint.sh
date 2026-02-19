#!/bin/bash
set -e

# Process React environment variables
for FILENAME in /app/server/src/client/app/build/static/js/*.js; do
	# We expect some paths/urls to contain '/' characters, so we use '*' instead
	sed "s*<REACT_APP_URL_SITE_BACKEND>*${REACT_APP_URL_SITE_BACKEND:-http://localhost:8000/}*g" --in-place ${FILENAME}
	sed "s*<REACT_APP_URL_API>*${REACT_APP_URL_API:-http://localhost:8000/api/}*g" --in-place ${FILENAME}
	sed "s*<REACT_APP_URL_ELASTICSEARCH>*${REACT_APP_URL_ELASTICSEARCH:-http://localhost:8000/es/}*g" --in-place ${FILENAME}
	sed "s*<REACT_APP_ELASTICSEARCH_VERSION_MAYOR>*${REACT_APP_ELASTICSEARCH_VERSION_MAYOR:-6}*g" --in-place ${FILENAME}
	sed "s*<REACT_APP_URL_MINIO>*${REACT_APP_URL_MINIO:-http://localhost:8000/data/}*g" --in-place ${FILENAME}
done

# Configure based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🚀 Starting in PRODUCTION mode"
    export FLASK_ENV=production
    export TESTING=${TESTING:-False}

    # Production gunicorn configuration
    WORKERS=${GUNICORN_WORKERS:-4}
    TIMEOUT=${GUNICORN_TIMEOUT:-120}
    LOG_LEVEL=${LOG_LEVEL:-warning}

    echo "Configuration:"
    echo "  Workers: $WORKERS"
    echo "  Timeout: $TIMEOUT"
    echo "  Log Level: $LOG_LEVEL"
    echo "  Testing Mode: $TESTING"

    exec gunicorn \
        --bind 0.0.0.0:5000 \
        --workers $WORKERS \
        --timeout $TIMEOUT \
        --log-level $LOG_LEVEL \
        --access-logfile - \
        --error-logfile - \
        --chdir /app \
        autoapp:app

elif [ "$ENVIRONMENT" = "development" ]; then
    echo "🔧 Starting in DEVELOPMENT mode"
    export FLASK_ENV=development
    export TESTING=${TESTING:-True}

    echo "Configuration:"
    echo "  Workers: 1 (development)"
    echo "  Reload: enabled"
    echo "  Testing Mode: $TESTING"

    exec gunicorn \
        --bind 0.0.0.0:5000 \
        --workers 1 \
        --reload \
        --log-level debug \
        --access-logfile - \
        --error-logfile - \
        --chdir /app \
        autoapp:app

else
    # Default/legacy mode - use current configuration
    echo "⚙️  Starting in DEFAULT mode (legacy)"
    echo "  Tip: Set ENVIRONMENT=production or ENVIRONMENT=development"

    sudo su unprivileged-user
    exec gunicorn -b 0.0.0.0:5000 autoapp:app --chdir /app
fi
