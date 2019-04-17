import dash
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
import plotly.plotly as py
import plotly.graph_objs as go
from layouts import get_graph_from_data
import re
from callbacks import register_callbacks

def create_dash_app(flaskapp):
    """Create a dashapp and embed it in the given flaskapp.
    (1) the “layout” of the app that describes the look and feel of the app - layouts.py
    (2) the “callbacks” that enable the apps to be interactive.

    Parameters
    ----------
    flaskapp : The flask application in which the dask app needs to be embedded.

    """    
    external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
    app = dash.Dash(server=flaskapp, url_base_pathname='/dashboard/',urlexternal_stylesheets=external_stylesheets)
    app.config.suppress_callback_exceptions = True
    app.layout = html.Div([
        dcc.Location(id='url', refresh=False),
        html.Div(id='page-content'),
              ])
    register_callbacks(app)

    index_page = html.Div([
        html.H1('Welcome to dash dashboard'),
        ])

   
    
    @app.callback(dash.dependencies.Output('page-content', 'children'),
      [dash.dependencies.Input('url', 'pathname')])
    def display_page(pathname):
        """
                Render different layouts or graphs based on URL path
        """
        if pathname is not None and '/dashboard/data' in pathname:
            id = max(int(re.search(r'\d+', pathname).group()),1)
            #return id
            layout = get_graph_from_data(id,id,app)
            return layout
        else:
            return index_page
     


