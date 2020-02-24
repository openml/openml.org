import os
import shutil

import dash
import dash_core_components as dcc
import dash_html_components as html
from flask_caching import Cache
from .callbacks import register_callbacks

# To do: Move to assets (Copied from Joaquin's react font)
font = ["Nunito Sans", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"',
        "Arial", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"']


def create_dash_app(flask_app):
    """Create a dash application with same server as given flask app.

    :param flask_app: This dash app runs on the same server as flask_app
    :return:
    """

    app = dash.Dash(__name__, server=flask_app, url_base_pathname='/dashboard/')
    cache = Cache(app.server, config={
        # try 'filesystem' if you don't want to setup redis
        'CACHE_TYPE': 'filesystem',
        'CACHE_DIR': 'flask-cache-dir'
    })
    app.config.suppress_callback_exceptions = True

    # Layout of the dashboard
    # 1. URL
    url = dcc.Location(id='url', refresh=False)
    # 2. Page content - loaded based on URL path
    page_content = html.Div(id='page-content', style={"fontFamily": font, 'background-color': 'white'})
    # 3. Loading icon
    global_loading_icon = dcc.Loading(html.Div(id='loading-indictor',
                                               style={'display': 'none'}),
                                      type='dot')
    app.layout = html.Div([url,
                           global_loading_icon,
                           page_content])

    # Callbacks
    register_callbacks(app, cache)

    print("Admin access may be required to create the cache directory")
    # Create a temporary cache for data transfer between callbacks - pkl files
    shutil.rmtree('cache', ignore_errors=True)
    os.system('sudo mkdir cache')
    os.system('sudo chmod 777 cache')
    return app
