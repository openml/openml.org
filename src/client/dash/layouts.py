import dash_core_components as dcc
import dash_table_experiments as dt
import dash_html_components as html
import pandas as pd
import urllib.request
import json


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
    #print(displayfeatures.head())
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
        html.H3('List and plot of features', style={'text-align': 'center'}),
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
                    max_rows_in_viewport=7,
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
        html.H3('Scatter matrix based on target', style={'text-align': 'center'}),
        html.Div(
            [dcc.Graph(
                id='matrix',
                style={'height': '60%', 'width': '100%',
                       'position': 'relative'})],
        ),
        # 5. Scatter plot with drop down list.
        html.H3('Scatter plot', style={'text-align': 'center'}),
        html.Div([
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

            # Scatter plot
            html.Div(
                [dcc.Graph(
                    id='scatterPlotGraph',
                    style={'height': '100%', 'width': '100%',
                           'position': 'absolute'})],
            )],
        )], className="container")
    return layout, df
