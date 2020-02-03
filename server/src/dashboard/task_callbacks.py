import re
from dash.dependencies import Input, Output
import plotly.graph_objs as go
from .layouts import *
from openml.extensions.sklearn import SklearnExtension


def register_task_callbacks(app, cache):
    @app.callback([Output('dummy', 'children'),
                   Output('tab1', 'children'),
                   Output('tab2', 'children')],
                  [Input('url', 'pathname'),
                   Input('metric', 'value'),
                   Input('button', 'n_clicks')
                   ])
    @cache.memoize(timeout=20)
    def update_task_plots(pathname, metric, n_clicks):
        """

        :param pathname: str
            The url pathname which contains task id
        :param metric: str
            Metric for plotting evaluations, ex: accuracy
        :param n_clicks: int
            No of clicks of "Fetch next 1000 runs" button
        :return:
            Interactive graph (Evaluations tab) and leaderboard(People tab)
        """
        n_runs = 100

        # extract task id
        if pathname is not None and '/dashboard/task' in pathname:
            task_id = int(re.search('task/(\d+)', pathname).group(1))
        else:
            return html.Div(), html.Div()

        if n_clicks is None:
            n_clicks = 0

        # pickle file which caches previous evaluations
        # df_old may contain 0-1000 evaluations (we cache this)
        # current request may be to include 1000-2000 evaluations (We fetch this)
        try:
            df_old = pd.read_pickle('cache/task'+str(task_id)+'.pkl')
        except OSError:
            df_old = pd.DataFrame()

        df_new = evaluations.list_evaluations(function=metric,
                                              task=[int(task_id)],
                                              sort_order="desc",
                                              offset=n_clicks*n_runs,
                                              size=n_runs,
                                              output_format='dataframe')

        if df_new.empty and df_old.empty:
            return html.Div(), html.Div()
        else:
            df = df_old.append(df_new)

        df.to_pickle('cache/task'+str(task_id)+'.pkl')
        run_link = []
        tick_text = []
        truncated = []


        # Plotly hack to add href to each data point
        for run_id in df["run_id"].values:
            link = "<a href=\"https://www.openml.org/r/" + str(run_id) + "/\"> "
            run_link.append(link)
        # Plotly hack to link flow names
        for flow_id in df["flow_id"].values:
            link = "<a href=\"https://www.openml.org/f/" + str(flow_id) + "/\">"
            tick_text.append(link)
        # Truncate flow names (50 chars)
        for flow in df['flow_name'].values:
            truncated.append(SklearnExtension.trim_flow_name(flow))
            #truncated.append(short[:50] + '..' if len(short) > 50 else short)

        df['flow_name'] = truncated

        # Figure 1 - Evaluations
        data = [go.Scatter(y=df["flow_name"],
                           x=df["value"],
                           mode='text+markers',
                           text=run_link,
                           #hovertext=df["value"].astype(str)+['<br>'] * df.shape[0] + ['click for more info'] * df.shape[0],
                           # hoverinfo='text',
                           # hoveron = 'points+fills',
                           hoverlabel=dict(bgcolor="white", bordercolor="black", namelength=-1),
                           marker=dict(opacity=0.5, symbol='diamond',
                                       color=df["run_id"],  # set color equal to a variable
                                       colorscale='RdBu', )
                           )
                ]
        layout = go.Layout(autosize=False, margin=dict(l=400), height=500+15*(df['flow_name'].nunique()),
                           title='Every point is a run, click for details <br>'
                                 'Every y label is a flow, click for details <br>'
                                 'Top '+str(n_runs)+' runs shown<br>',
                           font=dict(size=11),
                           width=1000,
                          # hovermode='x',
                           xaxis=go.layout.XAxis(side='top'),
                           yaxis=go.layout.YAxis(
                           autorange="reversed",
                               ticktext=tick_text + df["flow_name"],
                               tickvals=df["flow_name"]
                           ))
        fig = go.Figure(data, layout)

        # Figure 2 People
        tick_text = []
        run_link = []
        for run_id in df["run_id"].values:
            link = "<a href=\"https://www.openml.org/r/" + str(run_id) + "/\"> "
            run_link.append(link)

        for flow_id in df["flow_id"].values:
            link = "<a href=\"https://www.openml.org/f/" + str(flow_id) + "/\">"
            tick_text.append(link)

        df['upload_time'] = pd.to_datetime(df['upload_time'])
        df['upload_time'] = df['upload_time'].dt.date

        data = [go.Scatter(y=df["value"],
                           x=df["upload_time"],
                           mode='text+markers',
                           text=run_link,
                           hovertext=df["uploader_name"],
                           hoverlabel=dict(bgcolor="white", bordercolor="black"),
                           marker=dict(opacity=0.5, symbol='diamond',
                                       color=df["uploader"],  # set color equal to a variable
                                       colorscale='Rainbow', )
                           )
                ]
        layout = go.Layout(title='Contributions over time,<br>every point is a run, click for details',
                           autosize=True,  margin=dict(l=100), hovermode='y',
                           font=dict(size=11),
                           xaxis=go.layout.XAxis(showgrid=False),
                           yaxis=go.layout.YAxis(showgrid=True,
                                                 title=go.layout.yaxis.Title(text=str(metric)),
                                                 ticktext=tick_text + df["flow_name"],
                                                 showticklabels=True))
        fig1 = go.Figure(data, layout)

        # Leaderboard table

        top_uploader = (df.sort_values('value', ascending=False).groupby(['uploader_name'], sort=False))
        name = top_uploader['uploader_name'].unique()
        rank = list(range(1, len(name) + 1))
        entries = top_uploader['uploader_name'].value_counts().values
        leaderboard = pd.DataFrame({'Rank': rank, 'Name': name, 'Entries': entries}).reset_index()
        leaderboard.drop('Name', axis=1, inplace=True)
        ranks = []
        df = top_uploader.head(df.shape[1])
        for uploader in df['uploader_name']:
            ranks.append(leaderboard[leaderboard['uploader_name'] == uploader].Rank.values[0])
        df['Rank'] = ranks

        # Sort by time
        df.sort_values(by=['upload_time'], inplace=True)
        # Get highest score
        leaderboard = get_highest_rank(df, leaderboard)

        # Create table
        table = html.Div(
            dt.DataTable(
                data=leaderboard.to_dict('records'),
                columns=[{"name": i, "id": i} for i in leaderboard.columns],
                sort_action="native",
                row_deletable=False,
                style_cell={'textAlign': 'left', 'backgroundColor': 'white',
                            'minWidth': '100px', 'width': '150px', 'maxWidth': '300px',
                            'textAlign': 'left',
                            "fontFamily": font,
                            'textOverflow': 'ellipsis', "fontSize": 14,

                            },
                style_header={
                    'backgroundColor': 'white',
                    'fontWeight': 'bold'
                },
                selected_rows=[0],
                id='tasktable'),
        )
        return html.Div(dcc.Graph(figure=fig), style={'display':'none'}), \
               html.Div(dcc.Graph(figure=fig)),\
               html.Div([dcc.Graph(figure=fig1), html.Div('Leaderboard'), table]), \



