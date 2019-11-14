import dash
import dash_core_components as dcc
import dash_html_components as html
from .callbacks import register_callbacks
import os
import shutil

font = [
    "Nunito Sans",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
]


def create_dash_app(flask_app):
    """Create a dash application with same server as given flask app.

    :param flask_app: This dash app runs on the same server as flask_app
    :return:
    """

    app = dash.Dash(__name__, server=flask_app, url_base_pathname='/dashboard/')

    #app.enable_dev_tools()
    app.config.suppress_callback_exceptions = True
    app.layout = html.Div([dcc.Location(id='url', refresh=False),
                           dcc.Loading(html.Div(id='loading-indictor',
                                                style={'display':'none'}),
                                       type='dot'),
                           html.Div(id='page-content',style={"fontFamily": font,
                                                             'background-color': 'white'},
                                    )])
    register_callbacks(app)
    shutil.rmtree('cache', ignore_errors=True)
    os.system('sudo mkdir cache')
    os.system('sudo chmod 777 cache')
    return app
