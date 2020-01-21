import os
# -*- coding: utf-8 -*-
"""Create an application instance."""
from server.app import create_app

app = create_app()
app.secret_key = 'abcd'

if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT", 5000)), debug=True, ssl_context='adhoc')