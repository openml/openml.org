import os
import shutil

import dash
import dash_core_components as dcc
import dash_html_components as html

from .callbacks import register_callbacks

font = ["Nunito Sans", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"',
        "Arial", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"']


def create_dash_app(flask_app):
    """Create a dash application with same server as given flask app.

    :param flask_app: This dash app runs on the same server as flask_app
    :return:
    """

    app = dash.Dash(__name__, server=flask_app, url_base_pathname='/dashboard/')
    app.config.suppress_callback_exceptions = True

    # Generic layout of the dashboard
    url = dcc.Location(id='url', refresh=False)
    global_loading_screen = dcc.Loading(html.Div(id='loading-indictor',
                                        style={'display': 'none'}), type='dot')
    page_content = html.Div(id='page-content', style={"fontFamily": font, 'background-color': 'white'})
    app.layout = html.Div([url,
                           global_loading_screen,
                           page_content])
    # Callbacks
    register_callbacks(app)

    # Create a temporary cache for data transfer between callbacks
    shutil.rmtree('cache', ignore_errors=True)
    os.system('sudo mkdir cache')
    os.system('sudo chmod 777 cache')
    return app
