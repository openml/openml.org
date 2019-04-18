import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
import pandas as pd
import numpy as np
from flask import Flask
import urllib.request
import json
import plotly.plotly as py
import plotly.graph_objs as go
import re
import plotly
from plotly import tools
def register_callbacks(app):

    @app.callback(Output('singleVariableGraph', 'figure'),
        [
        Input('url', 'pathname'),
        Input('singleVariableDropDown', 'value'),
        Input('singleVariableRadio', 'value')
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

    @app.callback(
        Output('graph-gapminder', 'figure'),
        [Input('url','pathname'),
         Input('datatable-gapminder', 'rows'),
         Input('datatable-gapminder', 'selected_row_indices')])
    def update_figure(pathname,rows, selected_row_indices):
        if pathname is not None and '/dashboard/data' in pathname:
            dataSetCSVInt = max(int(re.search(r'\d+', pathname).group()), 1)
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
        dff = pd.DataFrame(rows)
        attributes=[]


        if len(selected_row_indices)!=0:
            dff = dff.loc[selected_row_indices]
            print(dff.head())
            attributes = dff["name"].values

        if len(attributes)==0:
            fig = tools.make_subplots(rows=1, cols=1)
            trace1 = go.Scatter(x=[20, 30, 40], y=[50, 60, 70])
            fig.append_trace(trace1,1,1)
        else:
            numplots =  len(attributes)
            fig = tools.make_subplots(rows=numplots, cols=1)
            i=1
            for attribute in attributes:
                if attribute in nominals:
                    trace1 = go.Histogram(x=sorted(df[attribute]))
                else:
                    trace1 = {
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
                    }
                fig.append_trace(trace1, i, 1)
                i=i+1



        fig['layout'].update(height=600, width=600, title='Distribution Subplots' )

        return fig

    @app.callback(Output('scatterPlotGraph', 'figure'), [
        Input('url', 'pathname'),
        Input('dualVariableDropdownNum1', 'value'),
        Input('dualVariableDropdownNum2', 'value'),
        Input('dualVariableDropdownNom', 'value'),

    ])
    def update_dualVariableGraph(pathname,at1, at2, colorCode):
        if pathname is not None and '/dashboard/data' in pathname:
            dataSetCSVInt = max(int(re.search(r'\d+', pathname).group()), 1)
            dataSetJSONInt = dataSetCSVInt
            print ('entered')
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

        fig = {
            'data': [go.Scatter(
                x=df[df[colorCode] == col][at1],
                y=df[df[colorCode] == col][at2],
                mode='markers',
                marker={
                    'size': 15,
                    'line': {'width': 0.5, 'color': 'white'}
                },
                name=col,

            ) for col in set(df[colorCode])],

            'layout': go.Layout(
                xaxis={'title': at1, 'autorange': True},
                yaxis={'title': at2, 'autorange': True},
                hovermode='closest',

            )
        }
        return fig


