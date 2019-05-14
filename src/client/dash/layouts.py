import dash_core_components as dcc
import dash_table_experiments as dt
import dash_html_components as html
import pandas as pd
import urllib.request
import json
from openml import flows


def get_layout_from_data(data_id, app):
    """
    :param data_id: int
        data ID of the data to be displayeds
    :param app: dash app
        dash application that requires the layout
    :return:layout: dash layout
        dash layout with graphs and tables for given data ID
    """
    # Get CSV ID from data ID
    url = "https://www.openml.org/api/v1/json/data/{}".format(data_id)
    response = urllib.request.urlopen(url)
    encoding = response.info().get_content_charset('utf8')
    description = json.loads(response.read().decode(encoding))
    csv_id = (description["data_set_description"]["file_id"])

    # Read CSV
    url = "https://www.openml.org/data/v1/get_csv/{}".format(csv_id)
    df = pd.read_csv(url)
    for column in df:
        df[column].fillna(df[column].mode())

    # Read metadata
    url = 'https://www.openml.org/api/v1/json/data/features/{}'.format(data_id)
    response = urllib.request.urlopen(url)
    encoding = response.info().get_content_charset('utf8')
    metadata = json.loads(response.read().decode(encoding))
    metadata = pd.DataFrame.from_dict(metadata["data_features"])
    d = metadata["feature"]
    features = pd.DataFrame.from_records(d)
    display_features = features[["name", "is_target",
                                 "data_type", "number_of_missing_values"]]
    display_features.columns = ["Attribute", "Target",
                                "DataType", "Missing values"]
    nominals = []
    numericals = []
    for feature in metadata["feature"]:
        if feature["is_target"] == "true":
            target = feature["name"]
        if feature["data_type"] == "nominal":
            nominals.append(feature["name"])
        else:
            numericals.append(feature["name"])

    # Define layout
    layout = html.Div([
        # 1. Hidden div to cache data and use in different callbacks
        html.Div(id='intermediate-value', style={'display': 'none'}),
        # 2. Title
        html.H3('List of attributes', style={'text-align': 'left','color':'black'}),
        html.P('Choose one or more attributes for violin plot(numeric) and'
               ' histogram (nominal)', style={'text-align': 'left', 'color': 'gray'}),
        # 3. Table with meta data
        html.Div([
            # 3a. Table with meta data on left side
            html.Div(
                dt.DataTable(
                    rows=display_features.to_dict('records'),
                    columns=display_features.columns,
                    column_widths=[120, 120, 120, 120],
                    min_width=600,
                    row_selectable=True,
                    filterable=True,
                    sortable=True,
                    selected_row_indices=[],
                    max_rows_in_viewport=15,
                    id='datatable',
                ), style={'width': '49%', 'display': 'inline-block',
                          'position': 'relative'}
            ),
            # 3b. Distribution graphs on the right side.for
            #     Callback = distribution_plot
            html.Div(
                id='distribution',
                style={'width': '49%', 'display': 'inline-block',
                       'position': 'relative'}
            ),
        ]),
        # 4. Adding tabs for multiple plots
        #    Add another tab for a new plot
        dcc.Tabs(id="tabs", children=[
            dcc.Tab(label='Feature Importance', children=[html.Div(id='fi')]),
            dcc.Tab(label='Scatter matrix', children=[html.Div(id='matrix')]),
            dcc.Tab(label='Scatter plot',
                children=[

                html.Div([

                html.Div(dcc.Dropdown(
                        id='dropdown1',
                        options=[
                            {'label': i , 'value': i} for i in numericals
                        ],

                    multi=False,
                    clearable=False,
                    value=numericals[0]
                    )),

                html.Div(dcc.Dropdown(
                        id='dropdown2',
                        options=[
                            {'label': i, 'value': i} for i in numericals
                        ],

                    multi=False,
                    clearable=False,
                   value=numericals[0]

                    )),

                html.Div(dcc.Dropdown(
                    id='dropdown3',
                    options=[
                        {'label': i, 'value': i} for i in nominals
                    ],

                    multi=False,
                    clearable=False,

                  value=nominals[0]

                )),

             html.Div(id='scatter_plot'),])
            ])#if numericals else dcc.Tab(label='Scatter Plot',children=[html.Div(html.P('No numericals found'))])
        ],
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