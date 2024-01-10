import re

import openml
import plotly.graph_objs as go
from dash import dcc, html
from dash.dependencies import Input, Output


def register_suite_callbacks(app, cache):
    @app.callback(
        Output("suite-scatter-plot", "children"),
        [
            Input("url", "pathname"),
            Input("xaxis-column", "value"),
            Input("yaxis-column", "value"),
            Input("xaxis-type", "value"),
            Input("yaxis-type", "value"),
        ],
    )
    def scatter_data_plot(pathname, x, y, x_type, y_type):
        suite_id = int(re.search(r"study/task/(\d+)", pathname).group(1))
        suite = openml.study.get_suite(suite_id)
        data_arr = openml.datasets.get_datasets(suite.data, download_data=False)
        arr_dataset_name = []
        arr_x = []
        arr_y = []
        for i in range(len(data_arr)):
            arr_dataset_name.append(data_arr[i].name)
            arr_x.append(data_arr[i].qualities[x])
            arr_y.append((data_arr[i].qualities[y]))
        fig = go.Figure()
        fig.add_trace(
            go.Scatter(x=arr_x, y=arr_y, mode="markers", text=arr_dataset_name)
        )
        fig.update_layout(
            xaxis_type=x_type, yaxis_type=y_type, xaxis_title=x, yaxis_title=y
        )
        graph = dcc.Graph(figure=fig)
        return html.Div(graph)

    @app.callback(
        Output("suite-histogram", "children"),
        [Input("url", "pathname"), Input("xaxis-hist", "value")],
    )
    def suite_histogram(pathname, key):
        suite_id = int(re.search(r"study/task/(\d+)", pathname).group(1))
        suite = openml.study.get_suite(suite_id)
        data_arr = openml.datasets.get_datasets(suite.data, download_data=False)
        arr_id = []
        arr_x = []
        for i in range(len(data_arr)):
            arr_id.append(data_arr[i].dataset_id)
            arr_x.append(data_arr[i].qualities[key])
        fig = go.Figure(data=[go.Histogram(x=arr_x)])
        graph = dcc.Graph(figure=fig)
        return html.Div(graph)


# omitting distribution plot
# def distplot_suite(pathname):
#     suite_id = int(re.search('study/task/(\d+)', pathname).group(1))
#     suite = openml.study.get_suite(suite_id)
#     all_scores = []
#     glist = []
#
#     for task_id in suite.tasks:
#         evaluations = openml.evaluations.list_evaluations(task = [task_id],
#         function = 'area_under_roc_curve', output_format='dataframe', size=10000)
#         print("eval for task id",task_id)
#         if(len(evaluations) == 0):
#             pass
#
#         else:
#             all_scores.append(evaluations)
#             x = evaluations.value.values
#             hist_data = [x]
#             group_labels = [evaluations.data_name.iloc[1]]
#             fig = ff.create_distplot(hist_data, group_labels, bin_size = 0.05)
#             graph = dcc.Graph(figure=fig)
#             glist.append(html.Div(dcc.Graph(figure=fig)))
#     return html.Div(glist)
