import plotly.graph_objs as go
import re
from dash.dependencies import Input, Output
from .helpers import *
from openml import tasks, runs, evaluations
TIMEOUT = 5*60

def register_flow_callbacks(app, cache):

    @app.callback(Output('flowplot', 'figure'),
                  [Input('url', 'pathname'),
                   Input('metric', 'value'),
                   Input('tasktype', 'value'),
                   Input('parameter', 'value')])
    @cache.memoize(timeout=TIMEOUT)
    def update_flow_plots(pathname, metric, tasktype, parameter):
        """

        :param pathname: url path
        :param metric: dropdown to choose function/metric
        :param tasktype:drop down to choose task type
        :param parameter: dropdown to choose parameter
        :return:
        """

        if pathname is not None and '/dashboard/flow' in pathname:
            flow_id = int(re.search('flow/(\d+)', pathname).group(1))
        else:
            return []

        # Get all tasks of selected task type
        task_types = ["Supervised classification", "Supervised regression", "Learning curve",
                      "Supervised data stream classification", "Clustering",
                      "Machine Learning Challenge",
                      "Survival Analysis", "Subgroup Discovery"]
        t_list = tasks.list_tasks(task_type_id=task_types.index(tasktype)+1)
        task_id = [value['tid'] for key, value in t_list.items()]

        # Get all evaluations of selected metric and flow
        import time
        start = time.time()
        df = evaluations.list_evaluations_setups(function=metric, flow=[flow_id],
                                                 size=1000, output_format='dataframe',
                                                 sort_order='desc'
                                                 )
        end = time.time()
        print("list flow evals took ", end-start, " sec")
        if df.empty:
            return go.Figure()

        # Filter type of task
        df = df[df['task_id'].isin(task_id)]
        run_link = []
        tick_text = []
        # Set clickable labels
        for run_id in df["run_id"].values:
            link = "<a href=\"https://www.openml.org/r/" + str(run_id) + "/\"> "
            run_link.append(link)

        for data_id in df["data_id"].values:
            link = "<a href=\"https://www.openml.org/d/" + str(data_id) + "/\">"
            tick_text.append(link)
        hover_text = []
        if parameter == 'None':
            color = [1] * len(df['data_name'])
            hover_text = df["value"]
            marker = dict(opacity=0.8, symbol='diamond',
                          color=color,  # set color equal to a variable
                          colorscale='Jet')
        else:
            color = []
            for param_dict in df.parameters:
                values = [value for key, value in param_dict.items() if parameter == key]

                if not values:
                    color.append('0')
                else:
                    color.append(values[0])
                    hover_text.append(values[0])
            if color[0].isdigit():
                color = list(map(int, color))
            else:
                color = pd.DataFrame(color)[0].astype('category').cat.codes
            marker = dict(opacity=0.8, symbol='diamond',
                          color=color,  # set color equal to a variable
                          colorscale='Jet', colorbar=dict(title='Colorbar'))
        data = [go.Scatter(x=df["value"],
                           y=df["data_name"],
                           mode='text+markers',
                           text=run_link,
                           hovertext=hover_text,
                           hoverlabel=dict(bgcolor="white", bordercolor="black"),
                           marker=marker)
                ]
        layout = go.Layout(hovermode='closest',
                           title='Every point is a run, click for details <br>'
                                 'Every y label is a dataset, click for details <br>'
                                 'Top 1000 runs shown',
                           font=dict(size=11),

                           autosize=False, width=1000, height=500 + 15*df['data_name'].nunique(),
                           xaxis=go.layout.XAxis(showgrid=False),
                           yaxis=go.layout.YAxis(showgrid=True,
                                                 ticktext=tick_text+df["data_name"],
                                                 tickvals=df["data_name"],
                                                 showticklabels=True))
        fig = go.Figure(data, layout)
        return fig
