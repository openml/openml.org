import dash
import dash_core_components as dcc
import dash_html_components as html
from .callbacks import register_callbacks
import os
import shutil


def create_dash_app(flask_app):
    """Create a dash application with same server as given flask app.

    :param flask_app: This dash app runs on the same server as flask_app
    :return:
    """
    app = dash.Dash(server=flask_app, url_base_pathname='/dashboard/')
    app.config.suppress_callback_exceptions = True
    app.layout = html.Div([dcc.Location(id='url', refresh=False), html.Div(id='page-content')])
    register_callbacks(app)
    shutil.rmtree('cache', ignore_errors=True)
    os.mkdir('cache')
