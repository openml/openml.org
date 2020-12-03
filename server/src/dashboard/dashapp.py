import os
import shutil
import openml
import dash
import dash_core_components as dcc
import dash_html_components as html
from flask_caching import Cache
from .dash_config import COMMON_CACHE
from .callbacks import register_callbacks

# TODO: Move to assets (Copied from Joaquin's react font)
font = ["Nunito Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI",
        "Roboto", "Helvetica Neue", "Arial", "sans-serif", "Apple Color Emoji",
        "Segoe UI Emoji", "Segoe UI Symbol"]


def create_dash_app(flask_app):
    """
    Create dash application
    :param flask_app: flask_app passed is the flask server for the dash app
    :return:
    """
    if COMMON_CACHE:
        root_dir = os.path.abspath(os.sep)
        if not os.path.exists(os.path.join(root_dir, 'public')):
            os.system(f"sudo mkdir {root_dir}/public")
        os.system(f"sudo chmod 777 {root_dir}/public")
        openml.config.cache_directory = os.path.join(root_dir, "public", "python-cache", ".openml", "cache")

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
    page_content = html.Div(id='page-content', style={"fontFamily": font,
                                                      'background-color': 'white'})
    # 3. Loading icon
    global_loading_icon = dcc.Loading(html.Div(id='loading-indicator',
                                               style={'display': 'none'}),
                                      type='dot')
    app.layout = html.Div([url,
                           global_loading_icon,
                           page_content])

    # Callbacks
    register_callbacks(app, cache)

    # Create a temporary cache for data transfer between callbacks - pkl files
    shutil.rmtree('cache', ignore_errors=True)
    os.system('sudo mkdir cache')
    os.system('sudo chmod 777 cache')
    return app
