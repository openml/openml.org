import openml
import plotly.figure_factory as ff
import plotly.graph_objs as go
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc
import pandas as pd
import re
import plotly.figure_factory as ff



def register_suite_callbacks(app):
    @app.callback(
        Output('distplot-suite', 'children'),
        [Input('url', 'pathname')]
    )
    def distplot_suite(pathname):
        suite_id = int(re.search('collections/tasks/(\d+)', pathname).group(1))
        suite = openml.study.get_suite(suite_id)
        all_scores = []
        glist = []

        for task_id in suite.tasks:
            evaluations = openml.evaluations.list_evaluations(task = [task_id], function = 'area_under_roc_curve', output_format='dataframe', size=10000)
            print("eval for task id",task_id)
            if(len(evaluations) == 0):
                pass

            else:
                all_scores.append(evaluations)
                x = evaluations.value.values
                hist_data = [x]
                group_labels = [evaluations.data_name.iloc[1]]
                fig = ff.create_distplot(hist_data, group_labels, bin_size = 0.05)
                graph = dcc.Graph(figure=fig)
                glist.append(html.Div(dcc.Graph(figure=fig)))
        return html.Div(glist)





