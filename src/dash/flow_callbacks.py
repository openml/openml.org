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


def register_flow_callbacks(app):

    @app.callback(Output('flowplot', 'figure'),
        [Input('intermediate-value', 'children'),
        Input('url', 'pathname'),
        Input('metric', 'value'),
        Input('tasktype', 'value'),
        Input('parameter', 'value'),])
    def update_flow_plots(df_json, pathname, metric, tasktype, parameter):
        """
        :param df_json: json
            task df cached by render_layout callback
        :param pathname: str
            url pathname entered
        :return:
            fig : Scatter plot
        """
        if pathname is not None and '/dashboard/flow' in pathname:
            print('entered flow plot')
        else:
            return []

        # Get all tasks of selected task type
        task_types = ["Supervised classification", "Supervised regression", "Learning curve",
                      "Supervised data stream classification", "Clustering",
                      "Machine Learning Challenge",
                      "Survival Analysis", "Subgroup Discovery"]
        TASK_TYPE_ID = task_types.index(tasktype)+1
        task_id = []
        tlist = tasks.list_tasks(task_type_id=TASK_TYPE_ID)
        for key, value in tlist.items():
            task_id.append(value['tid'])

        # Get all evaluations of given metric and flow id
        flow_id = int(re.search('flow/(\d+)', pathname).group(1))
        evals = evaluations.list_evaluations(function=metric, flow=[flow_id], sort_order='desc', size=10000)
        rows = []
        for id, e in evals.items():
            rows.append(vars(e))
        df = pd.DataFrame(rows)

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
            color = [1] * 1000
            hover_text = df["value"]
            marker = dict(opacity=0.8, symbol='diamond',
                                       color=color,  # set color equal to a variable
                                       colorscale='Jet')
            print ('None')
        else:
            color = []
            for run_id in df.run_id[:1000]:
                p = pd.DataFrame(runs.get_runs([run_id])[0].parameter_settings)
                row = p[p['oml:name'] == parameter]
                if row.empty:
                    color.append('0')
                else:
                    color.append(row['oml:value'].values[0])
                    hover_text.append(row['oml:value'].values[0])


            if color[0].isdigit():
                print(color)
                color = list(map(int, color))
            else:
                color = pd.DataFrame(color)[0].astype('category').cat.codes
            marker = dict(opacity=0.8, symbol='diamond',
                          color=color,  # set color equal to a variable
                          colorscale='Jet', colorbar=dict(title='Colorbar'))
        data = [go.Scatter(x=df["value"][:1000],
                           y=df["data_name"][:1000],
                           mode='text+markers',
                           text=run_link,
                           hovertext=hover_text,
                           hoverlabel=dict(bgcolor="white", bordercolor="black"),
                           marker= marker )

                ]
        layout = go.Layout(hovermode='closest',
            autosize=False, width=1200, height=3000, margin=dict(l=500),
            xaxis=go.layout.XAxis(showgrid=False),
            yaxis=go.layout.YAxis(showgrid=True,
                                  ticktext=tick_text+df["data_name"],
                                  tickvals=df["data_name"],
                                  showticklabels=True))
        fig = go.Figure(data, layout)
        return fig
