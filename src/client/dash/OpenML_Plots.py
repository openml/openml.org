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


def generate_app(dataSetCSVInt, dataSetJSONInt):
    """
    Generates and returns a Flask app that contains a visualization of the dataset given

    :param dataSetCSVInt: The integer corresponding to the CSV ID on the OpenML server
    :param dataSetJSONInt: The integer corresponding to the JSON ID on the OpenML server

    :returns: a Flask app that can be executed using app.run_server()
    """
    server = Flask(__name__)
    app = dash.Dash(server=server)


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
    #App layout definition


    app.layout = html.Div(children=[
        #First Plot: Data Analysis for 1 variable
        html.Div([
            html.Div(children=[
                html.Div(
                    [dcc.Dropdown(
                        id="singleVariableDropDown",
                        options=[
                            {'label': i , 'value': i} for i in labels
                        ],
                        multi = False,
                        clearable = False,
                        placeholder="Select an attribute",
                        value = labels[0]
                    )],
                    style={'width':'45%', 'display' : 'inline-block', 'top': '30%', 'position': 'relative'}
                ),html.Div([
                    html.H3("Color Code based on target class?"),
                    dcc.RadioItems(
                        id='singleVariableRadio',
                        options=[{'label': i, 'value': i} for i in ['Yes', 'No']],
                        value='No',
                        labelStyle={'display': 'inline-block'}
                    )],
                    style= {'width':'50%', 'display' : 'inline-block', 'float': 'right'}
                ),
            ],
                style ={'height': '5%', 'position' : 'absolute', 'display' : 'inline-block', 'width' : '100%'}),
            html.Div([dcc.Graph(
                id= "singleVariableGraph",
                style = {'height' : '100%', 'width': '100%',  'position' : 'absolute'}
            )],
            style = {'height': '27%', 'position' : 'absolute', 'display' : 'inline-block', 'top' : '5%', 'width' : '100%'})],
        ),
        #Second plot: Scatterplot
        html.Div([
            html.Div(children=[
                html.Div(
                    [dcc.Dropdown(
                        id='dualVariableDropdownNum1',
                        options=[
                            {'label': i , 'value': i} for i in numericals
                        ],
                        multi = False,
                        clearable = False,
                        placeholder="Select an attribute",
                        value = numericals[0]
                    )],
                    style={'width':'30%', 'display' : 'inline-block', 'position': 'relative'}
                ),
                html.Div(
                    [dcc.Dropdown(
                        id='dualVariableDropdownNum2',
                        options=[
                            {'label': i, 'value': i} for i in numericals
                        ],
                        multi=False,
                        clearable=False,
                        placeholder="Select an attribute",
                        value=numericals[1]
                    )],
                    style={'width': '30%', 'display': 'inline-block', 'left': '33%', 'position': 'absolute'}),
                html.Div(
                    [dcc.Dropdown(
                        id='dualVariableDropdownNom',
                        options=[
                            {'label': i, 'value': i} for i in nominals
                        ],
                        multi=False,
                        clearable=False,
                        placeholder="Color Code based on",
                        value=nominals[0]
                    )],
                    style={'width': '30%', 'display': 'inline-block', 'left': '66%', 'position': 'absolute'})
            ],
                style={'height': '5%', 'position': 'absolute', 'display': 'inline-block', 'width': '100%', 'top': '33%'}),
            html.Div([
                dcc.Graph(id='scatterPlotGraph',
                    style={'height': '100%', 'width': '100%', 'position': 'absolute'})],
                style={'height': '27%', 'position': 'absolute', 'display': 'inline-block', 'top': '38%', 'width': '100%'}
            )]
        ),
        #Third plot: Parrallel Coordinates Plot
        html.Div([dcc.Dropdown(
            id = 'parrallelLinesPlotDropdown',
            options= [{'label' : i, 'value' : i} for i in numericals],
            multi = True,
            clearable = False,
            value = []
            )],
                 style={'height': '5%', 'position': 'absolute', 'display': 'inline-block', 'width': '60%', 'top': '67%'}
        ),
        html.Div([
            dcc.Graph(id='ParallelLinesPlotGraph',
                      style={'height': '100%', 'width': '100%', 'position': 'absolute'})],
            style={'height': '27%', 'position': 'absolute', 'display': 'inline-block', 'top': '70%', 'width': '100%'}
        )
        ],
    style = {'width' : '95%', 'height' : '300%', 'position' : 'absolute', 'display': 'inline-block'})


    @app.callback(dash.dependencies.Output('singleVariableGraph', 'figure'),[
        dash.dependencies.Input('singleVariableDropDown', 'value'),
        dash.dependencies.Input('singleVariableRadio', 'value')
        ])
    def update_singleVariableGraph(attribute, colorCode):
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


    @app.callback(dash.dependencies.Output('scatterPlotGraph', 'figure'),[
        dash.dependencies.Input('dualVariableDropdownNum1', 'value'),
        dash.dependencies.Input('dualVariableDropdownNum2', 'value'),
        dash.dependencies.Input('dualVariableDropdownNom', 'value'),
        dash.dependencies.Input('ParallelLinesPlotGraph', 'selectedData')
        ])
    def update_dualVariableGraph(at1, at2, colorCode, selectedData):
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
                xaxis={'title': at1,  'autorange': True},
                yaxis={'title': at2, 'autorange': True},
                hovermode='closest',

            )
        }
        return fig

    @app.callback(dash.dependencies.Output('ParallelLinesPlotGraph', 'figure'),[
        dash.dependencies.Input('parrallelLinesPlotDropdown', 'value'),
        dash.dependencies.Input('scatterPlotGraph', 'selectedData')
    ])
    def update_linesPlot(ats, selecteddata):
        if target in numericals:
            fig = {
                'data': [go.Parcoords(
                    line=dict(color=df[target],
                              colorscale='Viridis',
                              showscale=True
                              ),
                    dimensions=list([
                        dict(
                            range=[min(df[i]), max(df[i])],
                            label=i,
                            values=df[i]
                        ) for i in ats
                    ])
                )]
            }
        if target not in numericals:
            fig = {
                'data' : [go.Parcoords(
                    line = dict(color = df["numerical_target"],
                                colorbar=dict(
                                    title=target,
                                    titleside='top',
                                    tickmode='array',
                                    tickvals=[numtar[i] for i in set(df[target])],
                                    ticktext=list(set(df[target])),
                                    ticks='outside'
                                ),
                        colorscale='Viridis',
                        showscale=True
                                ),
                    dimensions = list([
                        dict(
                            range = [min(df[i]), max(df[i])],
                            label = i,
                            values = df[i]
                        )for i in ats
                    ])
                )]
            }
        return fig

    app.css.append_css({"external_url": "https://codepen.io/chriddyp/pen/bWLwgP.css"})
    return app


if __name__ == "__main__":
    generate_app(14,14).run_server(debug = True)