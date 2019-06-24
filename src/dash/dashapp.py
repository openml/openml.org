import dash

import dash_core_components as dcc
import dash_html_components as html
from .callbacks import register_callbacks


def create_dash_app(flaskapp):
    """

    :param flaskapp: flask application
        flask application in which dash app needs to be embedded

    """
    external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
    app = dash.Dash(server=flaskapp, url_base_pathname='/dashboard/')
    app.config.suppress_callback_exceptions = True
    app.layout = html.Div([
                            dcc.Location(id='url', refresh=False),
                            html.Div(id='page-content'),
                            ])
    register_callbacks(app)
