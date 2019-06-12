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


def register_task_callbacks(app):
    @app.callback([Output('tab1', 'children'),
                   Output('tab2', 'children'),
                   ],
                  [Input('intermediate-value', 'children'),
                   Input('url', 'pathname'),
                   Input('metric', 'value')])
    def update_task_plots(df_json, pathname, metric):
        """
        :param df_json: json
            task df cached by display_page callback
        :param pathname: str
            url pathname entered
        :return:
            fig : Scatter plot of top 100 flows for the selected function
        """
        if pathname is not None and '/dashboard/task' in pathname:
            print('entered task plot')
        else:
            return []
        # List of evaluations to dataframe.
        task_id = int(re.search('task/(\d+)', pathname).group(1))
        eval_objects = evaluations.list_evaluations(function=metric, task=[int(task_id)], sort="desc",
                                                    size=10000)
        if not eval_objects:
            return []
        rows = []
        for id, e in eval_objects.items():
            rows.append(vars(e))
        df = pd.DataFrame(rows)
        # METHOD 1 of top 100 flows
        # Sort entire df, group by flow name, get 100 top runs in each group only for the first 100 groups
        top_runs = (df.groupby(['flow_name'], sort=False).head(100))
        evals = top_runs[top_runs.groupby(['flow_name']).ngroup() < 100]

        run_link = []
        tick_text = []
        uploader = []
        truncated = []

        for run_id in evals["run_id"].values:
            link = "<a href=\"https://www.openml.org/r/" + str(run_id) + "/\"> "
            run = runs.get_run(int(run_id), ignore_cache=False)
            uploader.append(run.uploader_name)
            run_link.append(link)

        for flow_id in evals["flow_id"].values:
            link = "<a href=\"https://www.openml.org/f/" + str(flow_id) + "/\">"
            tick_text.append(link)

        for flow in evals['flow_name'].values:
            truncated.append(flow[:50] + '..' if len(flow) > 50 else flow)

        evals['flow_name_t'] = truncated
        data = [go.Scatter(y=evals["flow_name"],
                           x=evals["value"],
                           mode='text+markers',
                           text=run_link,
                           hovertext=evals['flow_name'] + ['<br>'] * evals.shape[0] + evals["value"].astype(str)
                                     + ['<br>'] * evals.shape[0] + ['click for more info'] * evals.shape[0],
                           hoverinfo='text',
                           # hoveron = 'points+fills',
                           hoverlabel=dict(bgcolor="white", bordercolor="black", namelength=-1),
                           marker=dict(opacity=0.5, symbol='diamond',
                                       color=evals["run_id"],  # set color equal to a variable
                                       colorscale='Earth', )
                           )
                ]
        layout = go.Layout(autosize=False, margin=dict(l=400), width=1500, height=2 * evals.shape[0],
                           hovermode='closest',
                           xaxis=go.layout.XAxis(side='top'),
                           yaxis=go.layout.YAxis(
                               autorange="reversed",
                               ticktext=tick_text + evals["flow_name_t"], tickvals=evals["flow_name"]
                           ))
        fig = go.Figure(data, layout)

        # FIG 2
        evals['upload_time'] = pd.to_datetime(evals['upload_time'])
        evals['upload_time'] = evals['upload_time'].dt.date
        evals['uploader'] = uploader
        from sklearn import preprocessing
        le = preprocessing.LabelEncoder()
        evals['uploader_id'] = le.fit_transform(evals['uploader'])
        data = [go.Scatter(y=evals["value"],
                           x=evals["upload_time"],
                           mode='text+markers',
                           text=run_link,
                           hovertext=evals["uploader"],
                           hoverlabel=dict(bgcolor="white", bordercolor="black"),
                           marker=dict(opacity=0.5, symbol='diamond',
                                       color=evals["uploader_id"],  # set color equal to a variable
                                       colorscale='Earth', )
                           )
                ]
        layout = go.Layout(
            autosize=False, width=1200, height=600, margin=dict(l=500), hovermode='closest',
            xaxis=go.layout.XAxis(showgrid=False),
            yaxis=go.layout.YAxis(showgrid=True,
                                  title=go.layout.yaxis.Title(text=str(metric)),
                                  ticktext=tick_text + evals["flow_name"],
                                  showticklabels=True))
        fig1 = go.Figure(data, layout)
        # TABLE
        top_uploader = (evals.sort_values('value', ascending=False).groupby(['uploader'], sort=False))
        name = top_uploader['uploader'].unique()
        rank = list(range(1, len(name) + 1))
        entries = top_uploader['uploader'].value_counts().values
        leaderboard = pd.DataFrame({'Rank': rank, 'Name': name, 'Entries': entries}).reset_index()
        leaderboard.drop('Name', axis=1, inplace=True)
        ranks = []
        df = top_uploader.head(evals.shape[1])
        for uploader in df['uploader']:
            ranks.append(leaderboard[leaderboard['uploader'] == uploader].Rank.values[0])
        df['Rank'] = ranks
        df.sort_values(by=['upload_time'], inplace=True)
        leaderboard = get_highest_rank(df, leaderboard)
        table = html.Div(
            dt.DataTable(
                rows=leaderboard.to_dict('records'),
                columns=leaderboard.columns,
                column_widths=[200, 120, 120, 120],
                min_width=1000,
                row_selectable=False,
                filterable=True,
                sortable=True,
                selected_row_indices=[],
                max_rows_in_viewport=15,
                id='tasktable'
            ),
        )
        return html.Div(dcc.Graph(figure=fig)), html.Div([dcc.Graph(figure=fig1), html.Div('Leaderboard'), table])