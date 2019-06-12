import plotly.graph_objs as go
import re
from .layouts import get_layout_from_data, get_layout_from_task, get_layout_from_flow, get_layout_from_run
from plotly import tools
from dash.dependencies import Input, Output, State
import dash_html_components as html
import dash_core_components as dcc
from .helpers import *
import dash_table_experiments as dt
import numpy as np
from sklearn.metrics import precision_recall_curve, roc_curve
from sklearn.preprocessing import label_binarize
import time
from .data_callbacks import register_data_callbacks
from .task_callbacks import register_task_callbacks
from .flow_callbacks import register_flow_callbacks
from .run_callbacks import register_run_callbacks

def register_callbacks(app):
    """
    Registers the callbacks of the given dash app app
    :param app: Dash application

    """

    # Callback #1

    @app.callback([Output('page-content', 'children'),
                   Output('intermediate-value', 'children')],
                  [Input('url', 'pathname')])
    def render_layout(pathname):
        """
        Main callback invoked when a URL with a data or task ID is entered.
        :param: pathname: str
            The URL entered, typically consists of dashboard/data/dataID or
            dashboard/task/ID
        :return: page-content: dash layout
                 basic layout
        :return: intermediate-value: json
            Cached df in json format for sharing between callbacks
        """
        df = pd.DataFrame()
        if pathname is not None and '/dashboard/data' in pathname:
            id = int(re.search('data/(\d+)', pathname).group(1))
            start = time.time()
            layout, df = get_layout_from_data(id)
            cache = df.to_json(date_format='iso', orient='split')
            end = time.time()
            print("time taken for getting layout of data ", end - start)
            return layout, cache
        elif pathname is not None and 'dashboard/task' in pathname:
            id = int(re.search('task/(\d+)', pathname).group(1))
            layout, taskdf = get_layout_from_task(id, app)
            cache = taskdf.to_json(date_format='iso', orient='split')
            return layout, cache
        elif pathname is not None and 'dashboard/flow' in pathname:
            id = int(re.search('flow/(\d+)', pathname).group(1))
            layout, flowdf = get_layout_from_flow(id,app)
            cache = flowdf.to_json(date_format='iso', orient='split')
            return layout, cache
        elif pathname is not None and 'dashboard/run' in pathname:
            id = int(re.search('run/(\d+)', pathname).group(1))
            layout, rundf = get_layout_from_run(id, app)
            cache = rundf.to_json(date_format='iso', orient='split')
            return layout, cache
        else:
            index_page = html.Div([html.H1('Welcome to dash dashboard')])
            cache = df.to_json(date_format='iso', orient='split')
            return index_page, cache

    register_data_callbacks(app)
    register_run_callbacks(app)
    register_task_callbacks(app)
    register_flow_callbacks(app)





