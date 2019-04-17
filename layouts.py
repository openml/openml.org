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
import dash_table

def get_graph_from_data(dataSetCSVInt,dataSetJSONInt,app):

    """Get the graphs for a particular dataset. Invoked from dashapp.

  The graph is defined by the layout. Yo add a new type of plot, add a plot to the layout.

    Parameters
    ----------

    :param dataSetCSVInt: The integer corresponding to the CSV ID on the OpenML server
    :param dataSetJSONInt: The integer corresponding to the JSON ID on the OpenML server

    Returns
    -------
    the page layout with graphs corresponding to the dataset

    """
    url = "https://www.openml.org/data/v1/get_csv/{}".format(dataSetCSVInt)
    df = pd.read_csv(url)


    for column in df:
        df[column].fillna(df[column].mode())
    url = 'https://www.openml.org/api/v1/json/data/features/{}'.format(dataSetJSONInt)
    response = urllib.request.urlopen(url)
    encoding = response.info().get_content_charset('utf8')
    metadata = json.loads(response.read().decode(encoding))
    metadata = pd.DataFrame.from_dict(metadata["data_features"])
    d= metadata["feature"]
    featureinfo = pd.DataFrame.from_records(d)
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

    layout = html.Div(children=[
        html.Div([

            html.Div(
                    [dash_table.DataTable(
                        id='table',
                        columns=[{"name": i, "id": i} for i in featureinfo.columns],
                        data=featureinfo[:10].to_dict("rows"),
                        )],
                    
                    style={'width':'45%', 'display' : 'inline-block', 'top': '5%', 'position': 'relative'}
                    ),

            html.Div(
                [

                dcc.Dropdown(
                        id="singleVariableDropDown",
                        options=[
                        {'label': i , 'value': i} for i in labels
                        ],
                        multi = False,
                        clearable = False,
                        placeholder="Select an attribute",
                        value = labels[0]
                        ),

                    dcc.RadioItems(
                        id='singleVariableRadio',
                        options=[{'label': i, 'value': i} for i in ['Yes', 'No']],
                        value='No',
                        labelStyle={'display': 'inline-block'}
                        ),


                dcc.Graph(
                id= "singleVariableGraph",
                style = {'height' : '100%', 'width': '100%',  'position' : 'absolute'}
                )],
            style = {'height': '27%', 'position' : 'absolute', 'display' : 'inline-block', 'top' : '35%', 'width' : '100%'})
            ],
            ),
        ],

        
        style = {'width' : '95%', 'height' : '300%', 'position' : 'absolute', 'display': 'inline-block'})

    return layout