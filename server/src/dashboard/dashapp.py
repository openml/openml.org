import shutil

import dash
import openml
from dash import dcc, html
from flask_caching import Cache

from .caching import CACHE_DIR_ROOT, CACHE_DIR_FLASK, CACHE_DIR_DASHBOARD
from .callbacks import register_callbacks
from .dash_config import COMMON_CACHE

# TODO: Move to assets (Copied from Joaquin's react font)
font = [
    "Nunito Sans",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
]


def create_dash_app(flask_app):
    """
    Create dash application
    :param flask_app: flask_app passed is the flask server for the dash app
    :return:
    """

    if COMMON_CACHE:
        openml.config.cache_directory = CACHE_DIR_ROOT

    app = dash.Dash(__name__, server=flask_app, url_base_pathname="/dashboard/")
    cache = Cache(
        app.server,
        config={
            # try 'filesystem' if you don't want to setup redis
            "CACHE_TYPE": "filesystem",
            "CACHE_DIR": CACHE_DIR_FLASK,
        },
    )
    app.config.suppress_callback_exceptions = True

    # Layout of the dashboard
    # 1. URL
    url = dcc.Location(id="url", refresh=False)
    # 2. Page content - loaded based on URL path
    page_content = html.Div(
        id="page-content", style={"fontFamily": font, "background-color": "white"}
    )
    # 3. Loading icon
    global_loading_icon = dcc.Loading(
        html.Div(id="loading-indicator", style={"display": "none"}), type="dot"
    )
    app.layout = html.Div([url, global_loading_icon, page_content])

    register_callbacks(app, cache)
    shutil.rmtree(CACHE_DIR_DASHBOARD)
    CACHE_DIR_DASHBOARD.mkdir()
    return app
