import plotly.graph_objs as go
import re
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc
from .helpers import *
import dash_table as dt
import time

def register_task_callbacks(app):
    @app.callback(Output('tab1', 'children'),
                   #Output('tab2', 'children'),

                  [Input('url', 'pathname'),
                   Input('metric', 'value'),
                   Input('button','n_clicks')
                   ])
    def update_task_plots( pathname, metric, n_clicks):
        """
        :param df_json: json
            task df cached by display_page callback
        :param pathname: str
            url pathname entered
        :return:
            fig : Scatter plot of top 100 flows for the selected function
        """
        N_RUNS = 1000
        if pathname is not None and '/dashboard/task' in pathname:
            print('entered task plot', n_clicks)
        else:
            return []
        if n_clicks is None:
            n_clicks = 0
        # List of evaluations to dataframe.
        task_id = int(re.search('task/(\d+)', pathname).group(1))

        eval_objects = evaluations.list_evaluations(function=metric,
                                                    task=[int(task_id)],
                                                    sort_order="desc",
                                                    offset=n_clicks*N_RUNS,
                                                    size=N_RUNS)
        try:
            df_old = pd.read_pickle('task'+str(task_id)+'.pkl')
        except OSError:
            df_old = pd.DataFrame()

        if not eval_objects:
            if df_old.empty:
                return []
            else:
                df = df_old
        else:
            rows = []
            for id, e in eval_objects.items():
                rows.append(vars(e))
                df_new = pd.DataFrame(rows)
            if df_old.empty:
                df = df_new
            else:
                df = df_old.append(df_new)

        df.to_pickle('task'+str(task_id)+'.pkl')
        evals = df
        run_link = []
        tick_text = []
        uploader = []
        truncated = []

        for run_id in evals["run_id"].values:
            link = "<a href=\"https://www.openml.org/r/" + str(run_id) + "/\"> "
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
        layout = go.Layout(autosize=False, margin=dict(l=400), width=1500, # height=2*evals.shape[0],
                           hovermode='closest',
                           xaxis=go.layout.XAxis(side='top'),
                           yaxis=go.layout.YAxis(
                               autorange="reversed",
                               ticktext=tick_text + evals["flow_name_t"], tickvals=evals["flow_name"]
                           ))
        fig = go.Figure(data, layout)


        return html.Div(dcc.Graph(figure=fig))

    @app.callback(Output('tab2', 'children'),
                   [Input('url', 'pathname'),
                   Input('metric', 'value'),
                   Input('button','n_clicks')
                   ])
    def update_leader_board( pathname, metric,n_clicks):
        N_RUNS = 1000
        if pathname is not None and '/dashboard/task' in pathname:
            print('entered leader plot', n_clicks)
        else:
            return []
        if n_clicks is None:
            n_clicks = 0
        # List of evaluations to dataframe.
        task_id = int(re.search('task/(\d+)', pathname).group(1))

        eval_objects = evaluations.list_evaluations(function=metric,
                                                    task=[int(task_id)],
                                                    sort_order="desc",
                                                    size=N_RUNS)
        rows=[]
        for id, e in eval_objects.items():
            rows.append(vars(e))
            df= pd.DataFrame(rows)
        # METHOD 1 of top 100 flows
        # # Sort entire df, group by flow name, get 100 top runs in each group only for the first 100 groups
        top_runs = (df.groupby(['flow_name'], sort=False).head(100))
        evals = top_runs[top_runs.groupby(['flow_name']).ngroup() < 100]
        # FIG 2
        start = time.time()
        uploader =[]
        for run_id in evals["run_id"].values:
            name = runs.list_runs(id=[run_id])[run_id]['uploader']
            uploader.append(name)

        end = time.time()
        print("time for getting evaluation", end-start)
        tick_text=[]
        run_link=[]
        for run_id in evals["run_id"].values:
            link = "<a href=\"https://www.openml.org/r/" + str(run_id) + "/\"> "
            run_link.append(link)

        for flow_id in evals["flow_id"].values:
            link = "<a href=\"https://www.openml.org/f/" + str(flow_id) + "/\">"
            tick_text.append(link)



        evals['upload_time'] = pd.to_datetime(evals['upload_time'])
        evals['upload_time'] = evals['upload_time'].dt.date
        evals['uploader'] = uploader
        # from sklearn import preprocessing
        # le = preprocessing.LabelEncoder()
        # #evals['uploader_id'] = le.fit_transform(evals['uploader'])
        data = [go.Scatter(y=evals["value"],
                           x=evals["upload_time"],
                           mode='text+markers',
                           text=run_link,
                           hovertext=evals["uploader"],
                           hoverlabel=dict(bgcolor="white", bordercolor="black"),
                           marker=dict(opacity=0.5, symbol='diamond',
                                       color=evals["uploader"],  # set color equal to a variable
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
                data=leaderboard.to_dict('records'),
                columns=[{"name": i, "id": i} for i in leaderboard.columns],
                row_selectable="multi",
                sort_action="native",
                row_deletable=False,
                selected_rows=[0],
                id='tasktable'),
        )
        return html.Div([dcc.Graph(figure=fig1), html.Div('Leaderboard'), table])

