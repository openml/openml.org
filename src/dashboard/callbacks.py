import re
from .layouts import *
from dash.dependencies import Input, Output
import dash_html_components as html
from .helpers import *
from .data_callbacks import register_data_callbacks
from .task_callbacks import register_task_callbacks
from .flow_callbacks import register_flow_callbacks
from .run_callbacks import register_run_callbacks
from .study_callbacks import register_study_callbacks

import time

def register_callbacks(app):
    """Register all callbacks of the dash app

    :param app: the dash application
    :return:
    """

    @app.callback(Output('page-content', 'children'),

                  [Input('url', 'pathname')])
    def render_layout(pathname):
        """
        Main callback invoked when a URL with a data/run/flow/task ID is entered.
        :param: pathname: str
            The URL entered, typically consists of dashboard/data/dataID or
            dashboard/task/ID
        :return: page-content: dash layout
            The basic layout of the dash application in the requested URL
        :return: intermediate-value: json
            Cached df in json format for sharing between callbacks
        """
        df = pd.DataFrame()
        if pathname is not None:
            number_flag = any(c.isdigit() for c in pathname)

        if pathname is not None and '/dashboard/data' in pathname:
            if number_flag:
                data_id = int(re.search('data/(\d+)', pathname).group(1))
                layout = get_layout_from_data(data_id)
                return layout
            else:
                layout = get_dataset_overview()
                return layout
        elif pathname is not None and 'dashboard/task' in pathname:
            if number_flag:
                task_id = int(re.search('task/(\d+)', pathname).group(1))
                layout = get_layout_from_task(task_id)
                return layout
            else:
                layout = get_task_overview()
                return layout

        elif pathname is not None and 'dashboard/flow' in pathname:
            if number_flag:
                flow_id = int(re.search('flow/(\d+)', pathname).group(1))
                layout = get_layout_from_flow(flow_id)
                return layout
            else:
                layout = get_flow_overview()
                return layout

        elif pathname is not None and 'dashboard/run' in pathname:
            if number_flag:
                run_id = int(re.search('run/(\d+)', pathname).group(1))
                layout = get_layout_from_run(run_id)
                return layout
            else:
                layout = get_run_overview()
                return layout

        elif pathname is not None and 'dashboard/study' in pathname:
            study_id = int(re.search('study/(\d+)', pathname).group(1))
            layout = get_layout_from_study(study_id)
            return layout
        else:
            index_page = html.Div([html.H1('Welcome to dash dashboard')])
            return index_page

    register_data_callbacks(app)
    register_run_callbacks(app)
    register_task_callbacks(app)
    register_flow_callbacks(app)
    register_study_callbacks(app)





