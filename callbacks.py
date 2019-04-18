import dash
from pandas.api.types import is_numeric_dtype
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
import pandas as pd
import numpy as np
from pandas.io.json import json_normalize
from flask import Flask
import urllib.request
import json
import plotly.plotly as py
import plotly.graph_objs as go
import re
import plotly
from plotly import tools
def register_callbacks(app):
    @app.callback(
        Output('graph-gapminder', 'figure'),
        [Input('intermediate-value', 'children'),
         Input('url','pathname'),
         Input('datatable-gapminder', 'rows'),
         Input('datatable-gapminder', 'selected_row_indices')])
    def update_figure(df_json,pathname,rows, selected_row_indices):
        if pathname is not None and '/dashboard/data' in pathname:
            print('entered table update')
        else:
            return
        if df_json is None:
            return

        df = pd.read_json(df_json, orient='split')

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
                if is_numeric_dtype(df[attribute]):
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
                else:
                    trace1 = go.Histogram(x=sorted(df[attribute]))
                fig.append_trace(trace1, i, 1)
                i=i+1



        fig['layout'].update(height=600, width=600, title='Distribution Subplots' )

        return fig

    @app.callback(Output('scatterPlotGraph', 'figure'), [
        Input('intermediate-value', 'children'),
        Input('url', 'pathname'),
        Input('dualVariableDropdownNum1', 'value'),
        Input('dualVariableDropdownNum2', 'value'),
        Input('dualVariableDropdownNom', 'value'),

    ])
    def update_dualVariableGraph(df_json,pathname,at1, at2, colorCode):
        if pathname is not None and '/dashboard/data' in pathname:
            print ('entered scatter plot')
        else:
            return

        if df_json is None:
            return
        df = pd.read_json(df_json, orient='split')
        print("callback1")
        print(df.head())
        print(type(df_json))

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


