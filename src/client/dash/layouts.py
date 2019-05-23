import dash_core_components as dcc
import dash_table_experiments as dt
import dash_html_components as html
import pandas as pd
import urllib.request
import json
from openml import datasets, tasks, runs, flows, config, evaluations, study
import numpy as np



def get_data_metadata(data_id):
    data = datasets.get_dataset(data_id)
    features = pd.DataFrame([vars(data.features[i]) for i in range(0, len(data.features))])
    is_target=[]
    for name in features["name"]:
        if name == data.default_target_attribute:
            is_target.append("true")
        else:
            is_target.append("false")
    features["Target"] = is_target

    display_features = features[["name", "data_type",
                                 "number_missing_values", "Target"]]

    display_features.rename(columns={"name": "Attribute", "data_type":"DataType",
                                     "number_missing_values": "Missing values",
                                     }, inplace=True)
    nominals = []
    numericals = []
    for index, row in features.iterrows():
        if row["data_type"] == "nominal":
            nominals.append(row["name"])
        else:
            numericals.append(row["name"])
    X, y, categorical, attribute_names = data.get_data()
    df = pd.DataFrame(X, columns=attribute_names)
    for column in df:
        df[column].fillna(df[column].mode(), inplace=True)
    return df, display_features, numericals, nominals



def get_layout_from_data(data_id):
    """

    :param data_id: dataset id
    :return:
     layout: basic layout for data visualization (tables, htmlDiv and dropdown)
     df: df cached for use in callbacks

    """
    # Get data and metadata
    df, metadata, numericals, nominals = get_data_metadata(data_id)

    # Define layout
    layout = html.Div([
        # 1. Hidden div to cache df and use in different callbacks
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
                    rows=metadata.to_dict('records'),
                    columns=metadata.columns,
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
            # 3b. Distribution graphs on the right side
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
            dcc.Tab(label='Scatter matrix', children=[
                html.Div([
                    html.Div(
                        dcc.RadioItems(
                            id = 'radio',
                            options = [{'label': "Top 5 features", "value":"top"},
                                       {'label': "Top 5 numeric features", "value":"numeric"},
                                       {'label': "Top 5  nominal features", "value":"nominal"}],
                            value = "top"

                        )),
                    html.Div(id='matrix'),


                ])
            ]),
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
            ])if numericals else dcc.Tab(label='Scatter Plot',children=[html.Div(html.P('No numericals found'))])
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
            dcc.Tab(label='Evaluations', children=[html.Div( id='tab1')]),
                dcc.Tab(label='People', children=[html.Div(id='tab2'),
            ]),

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

def get_layout_from_run(run_id,app):
    items = vars(runs.get_run(int(run_id)))

    orderedDictList = (items['fold_evaluations'])
    df = pd.DataFrame(orderedDictList.items(),columns=['evaluations','results'])

    list = []
    error = []
    for dict in df['results']:
        x = (dict[0])
        values = [x[elem] for elem in x]
        mean = str(round(np.mean(np.array(values), axis=0),3))
        std = str(round(np.std(np.array(values), axis=0),3))
        list.append(values)
        error.append(mean+" \u00B1 "+std)
    df.drop(['results'],axis=1, inplace=True)
    df['results'] = list
    df['values'] = error
    d = df.drop(['results'], axis=1)

    layout = html.Div([
        html.Div(id='intermediate-value', style={'display': 'none'}),
        # 3a. Table with meta data on left side
        html.Div([
           html.Div(
            dt.DataTable(
                rows=d.to_dict('records'),
                columns=d.columns,
                column_widths=[200, 120, 120, 120],
                min_width=600,
                row_selectable=True,
                filterable=True,
                sortable=True,
                selected_row_indices=[],
                max_rows_in_viewport=15,
                id='runtable',
            ), style={'width': '49%', 'display': 'inline-block',
                       'position': 'relative'}
        ),
        # 3b. Distribution graphs on the right side.for
        #     Callback = distribution_plot
        html.Div(
            id='runplot',
            style={'width': '49%', 'display': 'inline-block',
                   'position': 'absolute'}
        ),
    ])
    ])
    return layout,df