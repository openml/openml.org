import dash
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
import numpy as np
from flask import Flask
import urllib.request
import json
import plotly.plotly as py
import plotly.graph_objs as go
import re
def register_callbacks(app):

    @app.callback(dash.dependencies.Output('singleVariableGraph', 'figure'),
        [
        dash.dependencies.Input('url', 'pathname'),
        dash.dependencies.Input('singleVariableDropDown', 'value'),
        dash.dependencies.Input('singleVariableRadio', 'value')
        ])
    def update_singleVariableGraph(pathname,attribute, colorCode):
        if pathname is not None and '/dashboard/data' in pathname:
            dataSetCSVInt = max(int(re.search(r'\d+', pathname).group()),1)
            dataSetJSONInt = dataSetCSVInt
        else:
            return

        url = "https://www.openml.org/data/v1/get_csv/{}".format(dataSetCSVInt)
        df = pd.read_csv(url)


        for column in df:
            df[column].fillna(df[column].mode())
        url = 'https://www.openml.org/api/v1/json/data/features/{}'.format(dataSetJSONInt)
        response = urllib.request.urlopen(url)
        encoding = response.info().get_content_charset('utf8')
        metadata = json.loads(response.read().decode(encoding))
        metadata = pd.DataFrame.from_dict(metadata["data_features"])
        numericals = []
        nominals = []
        labels = []
        for feature in metadata["feature"]:
            if feature["is_target"] == "true":
                target = feature["name"]
            if feature["data_type"] == "nominal":
                nominals.append(feature["name"])
            else:
                numericals.append(feature["name"])
            labels.append(feature["name"])
        if target not in numericals:
            numtar = {}
            counter = 0
            for i in set(df[target]):
                numtar[i] = counter
                counter += 1
            aplist = []
            for i in df[target]:
                aplist.append(numtar[i])
            df["numerical_target"] = aplist

        if pathname is not None and '/dashboard/data' in pathname:
            id = max(int(re.search(r'\d+', pathname).group()),1)
        if colorCode == "No":
            if attribute in nominals:
                fig = go.Figure(
                    data = [go.Histogram(x=sorted(df[attribute]))],
                    layout= {
                    "title": attribute,
                    "yaxis": {
                        "zeroline": True,
                    },
                }
                )
            else :
                fig = {
                    "data": [{
                        "type": 'violin',
                        "x": df[attribute],
                        "box": {
                            "visible": True
                        },
                        "line": {
                            "color": 'black'
                        },
                        "meanline": {
                            "visible": True
                        },
                        "fillcolor": '#8dd3c7',
                        "opacity": 0.6,
                        "x0": attribute
                    }],
                    "layout": {
                        "title": attribute,
                        "yaxis": {
                            "zeroline": False,
                        },
                        "autosize" : True

                    }
                }
        if colorCode == "Yes":
            if attribute in nominals:
                fig = go.Figure(
                    data=[go.Histogram(x=sorted(df[attribute][df[target] == i]), name = i)for i in set(df[target])] ,
                    layout={
                        "title": attribute,
                        "yaxis": {
                            "zeroline": True,
                        },
                        'barmode' : 'stack'
                    }
                )
            else:
                fig = {
                    "data": [
                        {
                            "type": 'violin',
                            "x": df[attribute][df[target] == i],
                            "y": 0,
                            "legendgroup": i,
                            "scalegroup": i,
                            "name": i,
                            "box": {
                                "visible": True
                            },
                            "meanline": {
                                "visible": True
                            },
                        } for i in set(df[target])
                    ],
                    "layout": {
                        "yaxis": {
                            "zeroline": False,
                        },
                        "violingap": 0,
                        "violinmode": "overlay"
                    }
                }
        return fig

