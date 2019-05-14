import dash_core_components as dcc
import dash_table_experiments as dt
import dash_html_components as html
import pandas as pd
import urllib.request
import json
from openml import flows

def get_graph_from_data(dataSetJSONInt, app):
    """
    :param dataSetJSONInt: int
        data ID of the data to be displayeds
    :param app: dash app
        dash application that requires the layout
    :return:layout: dash layout
        dash layout with graphs and tables for given data ID
    """
    # Get CSV ID from data ID
    url = "https://www.openml.org/api/v1/json/data/{}".format(dataSetJSONInt)
    response = urllib.request.urlopen(url)
    encoding = response.info().get_content_charset('utf8')
    description = json.loads(response.read().decode(encoding))
    dataSetCSVInt = (description["data_set_description"]["file_id"])
    # Read CSV
    url = "https://www.openml.org/data/v1/get_csv/{}".format(dataSetCSVInt)
    df = pd.read_csv(url)
    for column in df:
        df[column].fillna(df[column].mode())
    # Read metadata
    url = 'https://www.openml.org/api/v1/json/data/features/{}'.format(dataSetJSONInt)
    response = urllib.request.urlopen(url)
    encoding = response.info().get_content_charset('utf8')
    metadata = json.loads(response.read().decode(encoding))
    metadata = pd.DataFrame.from_dict(metadata["data_features"])
    d = metadata["feature"]
    featureinfo = pd.DataFrame.from_records(d)
    displayfeatures = featureinfo[["name", "is_target",
                                   "data_type", "number_of_missing_values"]]
    displayfeatures.columns = ["Attribute", "Target",
                               "DataType", "Missing values"]
    # Data processing
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
    # Define layout
    layout = html.Div([
        # 1. Hidden div to cache data and pass between callbacks
        html.Div(id='intermediate-value', style={'display': 'none'}),
        # 2. Title
        html.H3('List of attributes', style={'text-align': 'left','color':'black'}),
        html.P('Choose one or more attributes for distribution plots', style={'text-align': 'left', 'color': 'gray'}),
        # 3. Table and distribution graph layout
        html.Div([
            html.Div(
                dt.DataTable(
                    rows=displayfeatures.to_dict('records'),
                    columns=(displayfeatures.columns),
                    column_widths=[120, 120, 120, 120],
                    min_width=600,
                    row_selectable=True,
                    filterable=True,
                    sortable=True,
                    selected_row_indices=[],
                    max_rows_in_viewport=10,
                    id='datatable-gapminder',
                ),
                style={'width': '49%', 'display': 'inline-block',
                       'position': 'relative'}
            ),


            html.Div(

                dcc.Graph(
                    id='graph-gapminder'
                ),
                style={'width': '49%', 'display': 'inline-block',
                       'position': 'relative'}
            ),
        ]),
       # 4. Scatter matrix based on selected rows

        dcc.Tabs(id="tabs", children=[
            dcc.Tab(label='Scatter Matrix', children=[
                html.Div([
                    html.H3('Scatter matrix', style={'text-align': 'left'}),
                    html.P('Choose two or more attributes from table for scatter matrix',
                           style={'text-align': 'left', 'color': 'gray'}),
                    html.Div(id='matrix')]), #Graph will be passed to this Div

                ]),


        # 5. Scatter plot with drop down list.


        dcc.Tab(label='Scatter Plot', children=[
        html.Div([
            html.H3('Scatter plot', style={'text-align': 'left'}),
            html.Div(children=[
                # Dropdown 1
                html.Div(
                    [dcc.Dropdown(
                        id='dualVariableDropdownNum1',
                        options=[
                            {'label': i, 'value': i} for i in numericals
                        ],
                        multi=False,
                        clearable=False,
                        placeholder="Select an attribute",
                        value=numericals[0]
                    )],
                    style={'width': '30%', 'display': 'inline-block',
                           'position': 'relative'}
                ),
                # Dropdown 2
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
                    style={'width': '30%', 'display': 'inline-block',
                           'left': '33%', 'position': 'absolute'}
                ),
                # Dropdown 3
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
                    style={'width': '30%', 'display': 'inline-block',
                           'left': '66%', 'position': 'absolute'},
                ),
            ]),
            ]),
            # Scatter plot
            html.Div(id='scatterPlotGraph')
        ],
        )],
        )], className="container")
    return layout, df


def get_layout_from_task(taskid, app):
    """

    :param taskid: Id of the task in the URL
    :param app: Dash app for which a graph layout needs to be created based on the task
    :return:
    """
    url = "https://www.openml.org/api/v1/json/evaluationmeasure/list"
    response = urllib.request.urlopen(url)
    encoding = response.info().get_content_charset('utf8')
    evaluations = json.loads(response.read().decode(encoding))
    df = pd.DataFrame.from_dict(evaluations["evaluation_measures"]["measures"])
    layout = html.Div([
        html.Div(id='intermediate-value', style={'display': 'none'}),
        html.Div(children=[
            #1 Dropdown to choose metric
            html.Div(
                [dcc.Dropdown(
                    id='metric',
                    options=[
                        {'label': i, 'value': i} for i in df.measure.unique()
                    ],
                    multi=False,
                    clearable=False,
                    placeholder="Select an attribute",
                    value=df.measure.unique()[0]
                )],
                style={'width': '30%', 'display': 'inline-block',
                       'position': 'relative'},
            ),
            #2 Scatter plot of flow vs metric
            # Scatter plot
            dcc.Tabs(id="tabs", children=[
            dcc.Tab(label='Evaluations', children=[
              html.Div(
                [dcc.Graph(
                    id='taskplot',
                    style={'height': '100%', 'width': '100%',
                           'position': 'absolute'})], id='tab1')]),
                dcc.Tab(label='People', children=[
                    html.Div(
                        [dcc.Graph(
                            id='people',
                            style={'height': '100%', 'width': '100%',
                                   'position': 'absolute'})],id='tab2')]),

            ])
        ]),
    ])

    return layout, df


def get_layout_from_flow(id, app):
    """

    :param id: flow ID from path
    :param app: dash application
    :return:
    """
    # Dropdown #1 Metrics
    url = "https://www.openml.org/api/v1/json/evaluationmeasure/list"
    response = urllib.request.urlopen(url)
    encoding = response.info().get_content_charset('utf8')
    evaluations = json.loads(response.read().decode(encoding))
    df = pd.DataFrame.from_dict(evaluations["evaluation_measures"]["measures"])
    # Dropdown #2 task types
    task_types=["Supervised classification","Supervised regression", "Learning curve",
                "Supervised data stream classification","Clustering",
                "Machine Learning Challenge",
                "Survival Analysis","Subgroup Discovery"]
    # Dropdown #3 flow parameters
    P = flows.get_flow(id).parameters.items()
    Parameters = [x[0] for x in P]
    Parameters.append('None')
    layout = html.Div([
        html.Div(id='intermediate-value', style={'display': 'none'}),
        html.Div(children=[
            #1 Dropdown to choose metric
            html.Div(
                [dcc.Dropdown(
                    id='metric',
                    options=[
                        {'label': i, 'value': i} for i in df.measure.unique()
                    ],
                    multi=False,
                    clearable=False,
                    placeholder="Select an attribute",
                    value=df.measure.unique()[0]
                )],
                style={'width': '30%', 'display': 'inline-block',
                       'position': 'relative'},
            ),
            # 2 Dropdown to choose task type
            html.Div(
                [dcc.Dropdown(
                    id='tasktype',
                    options=[
                        {'label': i, 'value': i} for i in task_types
                    ],
                    multi=False,
                    clearable=False,
                    placeholder="Select an attribute",
                    value=task_types[0]
                )],
                style={'width': '30%', 'display': 'inline-block',
                       'position': 'relative'},
            ),
            # 3 Dropdown to choose parameter
            html.Div(
                [dcc.Dropdown(
                    id='parameter',
                    options=[
                        {'label': i, 'value': i} for i in Parameters
                    ],
                    multi=False,
                    clearable=False,
                    placeholder="Select an attribute",
                    value=Parameters[-1]
                )],
                style={'width': '30%', 'display': 'inline-block',
                       'position': 'relative'},
            ),

            html.Div(
                [dcc.Graph(
                    id='flowplot',
                    style={'height': '100%', 'width': '100%',
                           'position': 'absolute'})],
            ),

        ]),
    ])
    return layout, df