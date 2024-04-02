import re

import pandas as pd
import plotly.graph_objs as go
from dash import dash_table as dt
from dash import dcc, html
from dash.dependencies import Input, Output
from openml import evaluations
from openml.extensions.sklearn import SklearnExtension

from .caching import CACHE_DIR_DASHBOARD
from .dash_config import DASH_CACHING
from .helpers import get_highest_rank
from ...setup import SERVER_BASE_URL

font = [
    "Nunito Sans",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
]


TIMEOUT = 5 * 60 if DASH_CACHING else 0


def register_task_callbacks(app, cache):
    @app.callback(
        [
            Output("dummy", "children"),
            Output("tab1", "children"),
            Output("tab2", "children"),
        ],
        [
            Input("url", "pathname"),
            Input("metric", "value"),
            Input("button", "n_clicks"),
        ],
    )
    @cache.memoize(timeout=TIMEOUT)
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
        if pathname is not None and "/dashboard/task" in pathname:
            task_id = int(re.search(r"task/(\d+)", pathname).group(1))
        else:
            return html.Div(), html.Div(), html.Div()

        if n_clicks is None:
            n_clicks = 0

        # pickle file which caches previous evaluations
        # df_old may contain 0-1000 evaluations (we cache this)
        # current request may be to include 1000-2000 evaluations (We fetch this)
        filename_cache = CACHE_DIR_DASHBOARD / f"task{task_id}.pkl"
        df_old = pd.read_pickle(filename_cache) if filename_cache.exists() else pd.DataFrame()

        df_new = evaluations.list_evaluations(
            function=metric,
            tasks=[int(task_id)],
            sort_order="desc",
            offset=n_clicks * n_runs,
            size=n_runs,
            output_format="dataframe",
        )

        if df_new.empty and df_old.empty:
            return html.Div(), html.Div(), html.Div()

        df = pd.concat([df_old, df_new], ignore_index=True)

        df.to_pickle(filename_cache)
        run_link = []
        tick_text = []
        truncated = []
        # Plotly hack to add href to each data point
        for run_id in df["run_id"].values:
            link = f'<a href="{SERVER_BASE_URL}/r/{run_id}/">'
            run_link.append(link)
        # Plotly hack to link flow names
        for flow_id in df["flow_id"].values:
            link = f'<a href="{SERVER_BASE_URL}/f/{flow_id}/">'
            tick_text.append(link)
        # Truncate flow names (50 chars)
        for flow in df["flow_name"].values:
            truncated.append(SklearnExtension.trim_flow_name(flow))
            # truncated.append(short[:50] + '..' if len(short) > 50 else short)

        df["flow_name"] = truncated

        # Figure 1 - Evaluations
        data = [
            go.Scatter(
                y=df["flow_name"],
                x=df["value"],
                mode="text+markers",
                text=run_link,
                # hovertext=df["value"].astype(str)+['<br>'] *
                # df.shape[0] + ['click for more info'] * df.shape[0],
                # hoverinfo='text',
                # hoveron = 'points+fills',
                hoverlabel=dict(bgcolor="white", bordercolor="black", namelength=-1),
                marker=dict(
                    opacity=0.5,
                    symbol="diamond",
                    color=df["run_id"],  # set color equal to a variable
                    colorscale="RdBu",
                ),
            )
        ]

        layout = go.Layout(
            autosize=False,
            margin={"l": 400},
            height=500 + 15 * (df["flow_name"].nunique()),
            title="Every point is a run, click for details <br>"
            "Every y label is a flow, click for details <br>"
            "Top " + str(n_runs) + " runs shown<br>",
            font=dict(size=11),
            width=1000,
            # hovermode='x',
            xaxis=go.layout.XAxis(side="top"),
            yaxis=go.layout.YAxis(
                autorange="reversed",
                ticktext=tick_text + df["flow_name"],
                tickvals=df["flow_name"],
            ),
        )
        fig = go.Figure(data, layout)

        # Figure 2 People
        tick_text = []
        run_link = []
        for run_id in df["run_id"].values:
            link = '<a href="https://www.openml.org/r/' + str(run_id) + '/"> '
            run_link.append(link)

        for flow_id in df["flow_id"].values:
            link = '<a href="https://www.openml.org/f/' + str(flow_id) + '/">'
            tick_text.append(link)

        df["upload_time"] = pd.to_datetime(df["upload_time"])

        data = [
            go.Scatter(
                y=df["value"],
                x=df["upload_time"],
                mode="text+markers",
                text=run_link,
                hovertext=df["uploader_name"],
                hoverlabel=dict(bgcolor="white", bordercolor="black"),
                marker=dict(
                    opacity=0.5,
                    symbol="diamond",
                    color=df["uploader"],  # set color equal to a variable
                    colorscale="Rainbow",
                ),
            )
        ]
        layout = go.Layout(
            title="Contributions over time, every point is a run."
            "click for details",
            autosize=True,
            margin={"l": 100},
            hovermode="y",
            font=dict(size=11),
            xaxis=go.layout.XAxis(showgrid=False),
            yaxis=go.layout.YAxis(
                showgrid=True,
                title=go.layout.yaxis.Title(text=str(metric)),
                ticktext=tick_text + df["flow_name"],
                showticklabels=True,
            ),
        )
        fig1 = go.Figure(data, layout)

        # Leaderboard table
        max_score_by_uploader = df[["uploader_name", "value"]].groupby(["uploader_name"]).max()
        max_score_by_uploader = max_score_by_uploader.to_dict()["value"]
        submissions_by_uploader = df["uploader_name"].value_counts().to_dict()

        leaderboard = df.copy()[["uploader_name"]].drop_duplicates()
        leaderboard["Entries"] = leaderboard["uploader_name"].apply(submissions_by_uploader.get)
        leaderboard["Top Score"] = leaderboard["uploader_name"].apply(max_score_by_uploader.get)

        # Create table
        table = html.Div(
            dt.DataTable(
                data=leaderboard.to_dict("records"),
                columns=[{"name": i, "id": i} for i in leaderboard.columns],
                sort_action="native",
                row_deletable=False,
                style_cell={
                    "textAlign": "left",
                    "backgroundColor": "white",
                    "minWidth": "100px",
                    "width": "150px",
                    "maxWidth": "300px",
                    "fontFamily": font,
                    "textOverflow": "ellipsis",
                    "fontSize": 14,
                },
                style_header={"backgroundColor": "white", "fontWeight": "bold"},
                selected_rows=[0],
                id="tasktable",
            ),
        )
        dummy_fig = html.Div(dcc.Graph(figure=fig), style={"display": "none"})
        eval_div = html.Div(dcc.Graph(figure=fig))

        return (
            dummy_fig,
            eval_div,
            html.Div([dcc.Graph(figure=fig1), html.Div("Leaderboard"), table]),
        )
