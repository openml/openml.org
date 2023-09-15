import io
import re
import os

# import arff
import urllib.request

import dash_core_components as dcc
import dash_html_components as html
import numpy as np
import pandas as pd
import plotly
import plotly.graph_objs as go
from dash.dependencies import Input, Output
from scipy.io import arff
from sklearn.metrics import precision_recall_curve, roc_curve
from sklearn.preprocessing import label_binarize

from .dash_config import DASH_CACHING

TIMEOUT = 5 * 60 if DASH_CACHING else 0

SERVER_BASE_URL = os.getenv('BACKEND_BASE_URL', "https://www.openml.org/")

def register_run_callbacks(app, cache):
    @app.callback(
        Output("runplot", "children"),
        [
            Input("url", "pathname"),
            Input("runtable", "data"),
            Input("runtable", "selected_rows"),
        ],
    )
    @cache.memoize(timeout=TIMEOUT)
    def run_plot(pathname, rows, selected_row_indices):
        """

        :param df_json: cached data
        :param pathname: url
        :param rows: rows of the feature table
        :param selected_row_indices: selected rows of the feature table
        :return: subplots containing violin plot or histogram for selected_row_indices
        """
        run_id = int(re.search(r"run/(\d+)", pathname).group(1))
        try:
            df = pd.read_pickle("cache/run" + str(run_id) + ".pkl")
        except OSError:
            return []
        rows = pd.DataFrame(rows)

        if len(selected_row_indices) != 0 and not rows.empty:
            selected_rows = rows.loc[selected_row_indices]["evaluations"].values
            i = 0
            fig = plotly.subplots.make_subplots(
                rows=len(selected_rows), cols=1, subplot_titles=tuple(selected_rows)
            )
            for metric in selected_rows:
                measure = df.loc[df["evaluations"] == metric]
                x = measure["results"].values[0]
                trace1 = {
                    "type": "box",
                    "showlegend": False,
                    "x": x,
                    "name": "",
                    # "x0": attribute
                }
                i = i + 1
                fig.append_trace(trace1, i, 1)

            fig["layout"].update(
                title="",
                hovermode="closest",
                height=len(selected_rows) * 200,
                margin={"l": 0},
            )
            for i in fig["layout"]["annotations"]:
                i["font"]["size"] = 11
        else:
            fig = []

        return html.Div(dcc.Graph(figure=fig))

    @app.callback(
        [Output("pr", "children"), Output("roc", "children")],
        [Input("url", "pathname"), Input("runtable", "data")],
    )
    @cache.memoize(timeout=TIMEOUT)
    def pr_chart(pathname, rows):
        run_id = int(re.search(r"run/(\d+)", pathname).group(1))
        try:
            df = pd.read_pickle("cache/run" + str(run_id) + ".pkl")
        except OSError:
            return [], []
        task_type = df[df["evaluations"] == "task_type"]["results"].values[0]
        if "Classification" not in task_type:
            return "Only classification supported", "Only classification supported"
        pred_id = df[df["evaluations"] == "predictions"]["results"].values[0]
        url = (
            SERVER_BASE_URL + "data/download/{}".format(pred_id)
            + "/predictions.arff"
        )
        ftp_stream = urllib.request.urlopen(url)
        data, meta = arff.loadarff(io.StringIO(ftp_stream.read().decode("utf-8")))
        df = pd.DataFrame(data)
        df["prediction"] = df["prediction"].str.decode("utf-8")
        df["correct"] = df["correct"].str.decode("utf-8")
        confidence = ["confidence." + str(val) for val in df["correct"].unique()]
        y_codes = pd.Categorical(df["correct"]).codes
        y_score = df[confidence[1]].values
        n_classes = df["correct"].nunique()
        data = []
        roc = []
        if n_classes == 2:
            _, idx = np.unique(y_codes, return_index=True)
            y_test = label_binarize(y_codes, classes=y_codes[np.sort(idx)])
            precision, recall, thresholds = precision_recall_curve(
                y_test, y_score, pos_label=1
            )
            fpr, tpr, roc_thresh = roc_curve(y_test, y_score)

            h = ["Threshold: " + value for value in thresholds.astype(str)]
            trace1 = go.Scatter(
                x=recall,
                y=precision,
                hovertext=h,
                mode="lines",
                line=dict(width=2, color="navy"),
                name="Precision-Recall curve",
            )

            layout = go.Layout(
                xaxis=dict(title="Recall"), yaxis=dict(title="Precision")
            )

            fig = go.Figure(data=[trace1], layout=layout)
            h = ["Threshold: " + value for value in roc_thresh.astype(str)]
            trace2 = go.Scatter(
                x=fpr,
                y=tpr,
                hovertext=h,
                mode="lines",
                line=dict(width=2, color="navy"),
                name="ROC chart",
            )

            layout = go.Layout(xaxis=dict(title="FPR"), yaxis=dict(title="TPR"))

            fig2 = go.Figure(data=[trace2], layout=layout)

        else:
            precision = dict()
            recall = dict()
            threshold = dict()
            roc_thresh = dict()
            fpr = dict()
            tpr = dict()
            _, idx = np.unique(y_codes, return_index=True)
            y_test = label_binarize(y_codes, classes=y_codes[np.sort(idx)])
            for i in range(n_classes):
                y_score = df[confidence[i]].values
                precision[i], recall[i], threshold[i] = precision_recall_curve(
                    y_test[:, i], y_score, pos_label=1
                )
                fpr[i], tpr[i], roc_thresh[i] = roc_curve(y_test[:, i], y_score)

            for i in range(n_classes):
                h = ["Threshold: " + value for value in threshold[i].astype(str)]
                trace3 = go.Scatter(
                    x=recall[i],
                    y=precision[i],
                    name=confidence[i],
                    hovertext=h,
                    hoverinfo="text",
                    hoverlabel=dict(namelength=-1),
                    mode="lines",
                    line=dict(width=2),
                )
                data.append(trace3)
                h1 = ["Threshold: " + value for value in roc_thresh[i].astype(str)]
                trace = go.Scatter(
                    x=fpr[i],
                    y=tpr[i],
                    name=confidence[i],
                    hovertext=h1,
                    hoverinfo="text",
                    hoverlabel=dict(namelength=-1),
                    mode="lines",
                    line=dict(width=2),
                )
                roc.append(trace)

            layout = go.Layout(
                title="",
                xaxis=dict(title="Recall"),
                yaxis=dict(title="Precision"),
                height=400,
            )

            fig = go.Figure(data=data, layout=layout)
            layout = go.Layout(
                title="", xaxis=dict(title="fpr"), yaxis=dict(title="tpr"), height=400
            )

            fig2 = go.Figure(data=roc, layout=layout)
        graph = dcc.Graph(figure=fig)
        return html.Div(graph), html.Div(dcc.Graph(figure=fig2))
