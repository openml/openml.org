import re

import dash_html_components as html
from dash.dependencies import Input, Output

from .data_callbacks import register_data_callbacks
from .flow_callbacks import register_flow_callbacks
from .layouts import (get_layout_dataset_overview, get_layout_from_data,
                      get_layout_from_flow, get_layout_from_run,
                      get_layout_from_study, get_layout_from_suite,
                      get_layout_from_task, get_run_overview,
                      get_task_overview)
from .overviews import get_flow_overview, register_overview_callbacks
from .run_callbacks import register_run_callbacks
from .study_callbacks import register_study_callbacks
from .suite_callbacks import register_suite_callbacks
from .task_callbacks import register_task_callbacks

TIMEOUT = 5*60  # 5 minutes


def register_callbacks(app, cache):
    """
    Register all callbacks
    :param app: dash application
    :param cache: flask cache directory for memoization
    :return:
    """

    register_layout_callback(app, cache)
    register_data_callbacks(app, cache)
    register_run_callbacks(app, cache)
    register_task_callbacks(app, cache)
    register_flow_callbacks(app, cache)
    register_study_callbacks(app, cache)
    register_suite_callbacks(app, cache)
    register_overview_callbacks(app, cache)


def register_layout_callback(app, cache):
    @app.callback(
        [Output('page-content', 'children'),
         Output('loading-indicator', 'children')],
        [Input('url', 'pathname')]
    )
    @cache.memoize(TIMEOUT)
    def render_layout(pathname):
        """
        Main callback which displays different pages based on URL
        :param pathname: pathname such as dashboard/data/ID or dashboard/task/ID
        :return: the dash layout and a dummy value for global loading spinner (None)
        """
        layout = html.Div([html.H1('Welcome to dash dashboard')])
        if pathname is not None:
            number_flag = any(c.isdigit() for c in pathname)
            if 'dashboard/data' in pathname:
                if number_flag:
                    data_id = int(re.search(r'data/(\d+)', pathname).group(1))
                    layout = get_layout_from_data(data_id)
                else:
                    layout = get_layout_dataset_overview()
            elif 'dashboard/task' in pathname:
                if number_flag:
                    task_id = int(re.search(r'task/(\d+)', pathname).group(1))
                    layout = get_layout_from_task(task_id)
                else:
                    layout = get_task_overview()

            elif 'dashboard/flow' in pathname:
                if number_flag:
                    flow_id = int(re.search(r'flow/(\d+)', pathname).group(1))
                    layout = get_layout_from_flow(flow_id)
                else:
                    layout = get_flow_overview()

            elif 'dashboard/run' in pathname:
                if number_flag:
                    run_id = int(re.search(r'run/(\d+)', pathname).group(1))
                    layout = get_layout_from_run(run_id)
                else:
                    layout = get_run_overview()

            elif 'dashboard/study/run' in pathname:
                study_id = int(re.search(r'study/run/(\d+)', pathname).group(1))
                layout = get_layout_from_study(study_id)

            elif 'dashboard/study/task' in pathname:
                suite_id = int(re.search(r'study/task/(\d+)', pathname).group(1))
                layout = get_layout_from_suite(suite_id)

        return layout, None
