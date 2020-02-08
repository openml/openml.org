import re


from .layouts import *
from .overviews import *
from .data_callbacks import register_data_callbacks
from .task_callbacks import register_task_callbacks
from .flow_callbacks import register_flow_callbacks
from .run_callbacks import register_run_callbacks
from .study_callbacks import register_study_callbacks
from .suite_callbacks import register_suite_callbacks


def register_callbacks(app, cache):
    """Register all callbacks of the dash app

    :param app: the dash application
    :return:
    """

    @app.callback([Output('page-content', 'children'),
                   Output('loading-indictor', 'children')],

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

        if pathname is not None:
            number_flag = any(c.isdigit() for c in pathname)

        if pathname is not None and '/dashboard/data' in pathname:
            if number_flag:
                data_id = int(re.search('data/(\d+)', pathname).group(1))
                layout = get_layout_from_data(data_id)
                return layout, None
            else:
                layout = get_layout_dataset_overview()
                return layout, None
        elif pathname is not None and 'dashboard/task' in pathname:
            if number_flag:
                task_id = int(re.search('task/(\d+)', pathname).group(1))
                layout = get_layout_from_task(task_id)
                return layout, None
            else:
                layout = get_task_overview()
                return layout, None

        elif pathname is not None and 'dashboard/flow' in pathname:
            if number_flag:
                flow_id = int(re.search('flow/(\d+)', pathname).group(1))
                layout = get_layout_from_flow(flow_id)
                return layout, None
            else:
                layout = get_flow_overview()
                return layout, None

        elif pathname is not None and 'dashboard/run' in pathname:
            if number_flag:
                run_id = int(re.search('run/(\d+)', pathname).group(1))
                layout = get_layout_from_run(run_id)
                return layout, None
            else:
                layout = get_run_overview()
                return layout, None

        elif pathname is not None and 'dashboard/study/run' in pathname:
            study_id = int(re.search('study/run/(\d+)', pathname).group(1))
            layout = get_layout_from_study(study_id)
            return layout, None

        elif pathname is not None and 'dashboard/study/task' in pathname:
            suite_id = int(re.search('study/task/(\d+)', pathname).group(1))
            layout = get_layout_from_suite(suite_id)
            return layout, None
        else:
            index_page = html.Div([html.H1('Welcome to dash dashboard')])
            return index_page, None

    register_data_callbacks(app, cache)
    register_run_callbacks(app, cache)
    register_task_callbacks(app, cache)  # Has caching for 60 seconds
    register_flow_callbacks(app, cache)
    register_study_callbacks(app, cache)
    register_suite_callbacks(app, cache)
    register_overview_callbacks(app, cache)




