import os
import dash_table as dt
import plotly
import plotly.graph_objs as go

from .helpers import *
from .dashapp import *

from openml import runs, flows, evaluations, setups, study, datasets, tasks
from openml.extensions.sklearn import SklearnExtension

font = ["Nunito Sans", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"',
        "Arial", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"']


def get_layout_from_data(data_id):
    """

    :param data_id: dataset id
    :return:
     layout: custom layout for data visualization

    """
    # Get data and metadata
    df, metadata, numerical_data, nominal_data, name = get_data_metadata(data_id)
    selected_rows = list(range(0, 5))
    if len(df.columns) < 5:
        selected_rows = list(range(0, len(df.columns)))

    # Define layout components
    # Feature table
    distribution = html.Div([html.Div(dcc.Loading(
        dt.DataTable(data=metadata.to_dict('records'),
                     columns=[{"name": i, "id": i} for i in metadata.columns],
                     row_selectable="multi",
                     sort_action="native",
                     row_deletable=False,
                     selected_rows=selected_rows,
                     filter_action="native",
                     id='datatable',
                     style_header={'backgroundColor': 'white', 'fontWeight': 'bold'},
                     style_cell={'textAlign': 'left', 'backgroundColor': 'white', 'minWidth': '100px', 'width': '150px',
                                 'maxWidth': '300px', "fontFamily": font, 'textOverflow': 'ellipsis', "fontSize": 11},
                     style_table={'minHeight': '420px', 'maxHeight': '420px', 'overflowY': 'scroll'},
                     page_action='none',
                     # Select special rows to highlight
                     style_data_conditional=[
                         {
                             "if": {"row_index": 0},
                             "backgroundColor": "rgb(0, 100, 255)",
                             'color': 'white'
                         },
                         {
                             'if': {'column_id': 'Missing values',
                                    'filter_query': '{Missing values} > 0'
                                    },
                             'backgroundColor': 'rgb(255, 200, 200)', 'color': 'white'
                         },
                         {
                             'if': {'column_id': 'Missing values',
                                    'filter_query': '{Missing values} > 10'
                                    },
                             'backgroundColor': 'rgb(255, 100, 100)', 'color': 'white'
                         },
                         {
                             'if': {'column_id':'Missing values',
                                    'filter_query': '{Missing values} > 50'
                                    },
                             'backgroundColor': 'rgb(255, 50, 50)', 'color': 'white'
                         },
                         {
                             'if': {'column_id': 'Missing values',
                                    'filter_query': '{Missing values} > 100'
                                    },
                             'backgroundColor': 'rgb(255, 0, 0)', 'color': 'white'
                         },
                     ]
                     ), fullscreen=True),
        style={'width': '45%', 'display': 'inline-block','position': 'relative'}
    ),
        html.Div([
            html.Div(
                dcc.RadioItems(
                    id='radio1',
                    options=[{'label': "Target based distribution", "value": "target"},
                             {'label': "Individual distribution", "value": "solo"}],
                    value="solo",
                    labelStyle={'display': 'inline-block', 'text-align': 'justify'}

                )),
            html.Div(
                dcc.RadioItems(
                    id='stack',
                    value='group',
                    labelStyle={'display': 'inline-block', 'text-align': 'justify'}
                )),
            dcc.Loading(html.Div(
                id='distribution', style={'overflowY': 'scroll', 'width': '100%',
                                          'height': '400px', 'position': 'absolute'})),
        ], style={'width': '50%', 'display': 'inline-block',
                  'position': 'absolute'}
        )])

    # Feature importance
    feature_importance = html.Div(id='Feature Importance',
                                  children=[html.H2('RandomForest Feature Importance'),
                                            dcc.Loading(html.Div(id='fi'))])

    # Feature Interaction
    feature_interaction = html.Div(id="tab2", children=[
        html.Div([
            html.H2('Feature Interactions'),
            html.Div(
                dcc.RadioItems(
                    id='radio',
                    options=[{'label': "Top five feature interactions", "value": "top"},
                             {'label': "Top five numeric feature interactions", "value": "numeric"},
                             {'label': "Top five nominal feature interactions", "value": "nominal"}],
                    value="top"

                ), ),
            dcc.Loading(html.Div(id='matrix')),
            html.Div(id='hidden', style={'display': 'none'})

        ])
    ])

    # Scatter plot
    scatter_plot = html.Div(id="tab3", children=[html.Div([
                    html.H2('Scatter plot'),
                    html.Div(dcc.Dropdown(
                        id='dropdown1',
                        options=[
                            {'label': i, 'value': i} for i in numerical_data],
                        multi=False,
                        clearable=False,
                        value=numerical_data[0]
                    ), style={'width': '30%'}),
                    html.Div(dcc.Dropdown(
                        id='dropdown2',
                        options=[
                            {'label': i, 'value': i} for i in numerical_data
                        ],
                        multi=False,
                        clearable=False,
                        value=numerical_data[0]

                    ),style={'width': '30%'}),
                    html.Div(dcc.Dropdown(
                        id='dropdown3',
                        options=[
                            {'label': i, 'value': i} for i in nominal_data],
                        multi=False,
                        clearable=False,
                        value=nominal_data[0]), style={'width': '30%'}),
                    html.Div(id='scatter_plot'), ])
            ])if numerical_data and nominal_data else dcc.Tab(label='Scatter Plot',
                                                              children=[html.Div(
                                                                  html.P('No numerical-nominal combination found'))]
                                                              )

    table_graph = dcc.Loading(html.Div(id='table-graph'))
    # Define layout using components
    layout = html.Div(children=[
        html.H2(name+' dataset', style={'text-align': 'left', 'text-color': 'black'}),
        html.P('Choose one or more attributes for distribution plot',
               style={'text-align': 'left', 'color': 'gray',
                      }),

        distribution,
        #table_graph,
        feature_importance,
        feature_interaction,
        scatter_plot,

    ], className='container'),
    return layout


def get_layout_from_task(task_id):
    """

    :param task_id:
    :return:
    layout: the layout for task visualization

    """

    measures = (evaluations.list_evaluation_measures())
    try:
        os.remove('cache/task'+str(task_id)+'.pkl')
    except OSError:
        pass

    # Define components in task layout
    loading_spinner = dcc.Loading(html.Div(id='dummy'), type='dot')
    hidden_div = html.Div(id='intermediate-value', style={'display': 'none'})
    metric_dropdown = html.Div(
        [dcc.Dropdown(
            id='metric',
            options=[
                {'label': i, 'value': i} for i in measures
            ],
            multi=False,
            clearable=False,
            placeholder="Select an attribute",
            value=measures[0]
        )],
        style={'width': '30%', 'display': 'inline-block',
               'position': 'relative'},
    )

    fetch_runs_button = html.Div(html.Button('Fetch next 100 runs', id='button',
                                 style={'fontSize': 14,
                                        'color': 'black',
                                        'width': '20',
                                        'height': '30',
                                        'background-color': 'white'}))
    graph_evals = html.Div(id='tab1')
    graph_people = html.Div(id='tab2')

    layout = html.Div([
        loading_spinner,
        hidden_div,
        html.Div(children=[
            metric_dropdown,
            html.H4('Evaluations:'),
            graph_evals,
            html.H4('People:'),
            graph_people,
            html.P(" "),
            html.P(" "),
            fetch_runs_button,
        ]),
    ], style={'width': '100%'})

    return layout


def get_layout_from_flow(flow_id):
    """

    :param flow_id:
    :return:
    """

    measures = (evaluations.list_evaluation_measures())

    task_types = ["Supervised classification", "Supervised regression", "Learning curve",
                  "Supervised data stream classification", "Clustering", "Machine Learning Challenge",
                  "Survival Analysis", "Subgroup Discovery"]

    setup_list = setups.list_setups(flow=flow_id, size=1, output_format='dataframe')
    parameter_dict = setup_list['parameters'].values[0]
    parameters = [param['full_name'] for key, param in parameter_dict.items()]
    parameters.append('None')

    # Define components of flow layout
    dropdown_metric = html.Div(
                [dcc.Dropdown(
                    id='metric',
                    options=[
                        {'label': i, 'value': i} for i in measures
                    ],
                    multi=False,
                    clearable=False,
                    placeholder="Select an attribute",
                    value=measures[0]
                )],
                style={'width': '30%', 'display': 'inline-block',
                       'position': 'relative'},
            )
    dropdown_tasktype = html.Div(
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
            )
    dropdown_parameter = html.Div(
                [dcc.Dropdown(
                    id='parameter',
                    options=[
                        {'label': i, 'value': i} for i in parameters
                    ],
                    multi=False,
                    clearable=False,
                    placeholder="Select an attribute",
                    value=parameters[-1]
                )],
                style={'width': '30%', 'display': 'inline-block',
                       'position': 'relative'},
            )
    flow_graph = html.Div(
                [dcc.Loading(dcc.Graph(
                    id='flowplot',
                    style={'height': '100%', 'width': '100%',
                           'position': 'absolute'}))])
    layout = html.Div([
        html.Div(id='intermediate-value', style={'display': 'none'}),
        html.Div(children=[
            dropdown_metric,
            dropdown_tasktype,
            dropdown_parameter,
            flow_graph])
    ])

    return layout


def get_layout_from_run(run_id):
    """

    :param run_id: id of the run
    :return: layout for run dashboard
    """
    items = vars(runs.get_run(int(run_id)))
    ordered_dict = (items['fold_evaluations'])
    df = pd.DataFrame(ordered_dict.items(), columns=['evaluations', 'results'])
    result_list = []
    error = []
    for dic in df['results']:
        x = (dic[0])
        values = [x[elem] for elem in x]
        mean = str(round(np.mean(np.array(values), axis=0),3))
        std = str(round(np.std(np.array(values), axis=0),3))
        result_list.append(values)
        error.append(mean+" \u00B1 "+std)
    df.drop(['results'], axis=1, inplace=True)
    df['results'] = result_list
    df['values'] = error
    d = df.drop(['results'], axis=1)

    # Define components of run layout
    run_title = html.H2('Run ' + str(run_id), style={'text-align': 'left', 'text-color': 'black'})
    run_table = html.Div(
               dt.DataTable(
                   data=d.to_dict('records'),
                   columns=[{"name": i, "id": i} for i in d.columns],
                   row_selectable="multi",
                   sort_action="native",
                   row_deletable=False,
                   selected_rows=[0,1,2],
                   style_header={
                       'backgroundColor': 'white',
                       'fontWeight': 'bold'
                   },

                   style_cell={'textAlign': 'left', 'backgroundColor': 'white',
                               'minWidth': '50px', 'width': '150px', 'maxWidth': '300px',
                               'textAlign': 'left',
                               'textOverflow': 'ellipsis', "fontSize": 11,
                               "fontFamily": font
                               },
                   style_table={
                       'minHeight': '420px',
                       'maxHeight': '420px',
                       'overflowY': 'scroll',
                       'border': 'thin lightgrey solid'
                   },
                   id='runtable'),  style={'width': '45%', 'display': 'inline-block','position': 'relative'}
           )

    run_plot = html.Div(
            id='runplot',
               style={'width': '50%', 'display': 'inline-block', 'overflowY': 'scroll', 'height':'400px',
                      'position': 'absolute'}
           )
    pr_chart = dcc.Loading(html.Div(id='pr'))
    roc_chart = html.Div(id='roc')
    layout = html.Div([
        run_title,
        html.P('Choose one or more measures from the table',
               style={'text-align': 'left', 'color': 'gray', "fontSize": 11,
                      }),
        html.Div([
            run_table,
            run_plot,
        ]),
        html.H4("PR chart:"),
        pr_chart,
        html.H4("ROC curve:"),
        roc_chart
    ], style={'overflowY': 'hidden'})

    # Add some more rows indicating prediction id
    df2 = pd.DataFrame(items['output_files'].items(), columns=['evaluations', 'results'])
    df2["values"] = ""
    df3 = pd.DataFrame({'task_type': items['task_type']}.items(), columns=['evaluations', 'results'])
    df2["values"] = ""
    df = df.append(df2)
    df = df.append(df3)
    df.to_pickle('cache/run'+str(run_id)+'.pkl')
    return layout


def get_layout_from_study(study_id):
    """
    params:
    study_id: study id provided
    outpus:
    scatter plot for runs and studies combined
    """
    # items = study.get_study(int(study_id))
    # run_ids = items.runs[1:300]
    # item = evaluations.list_evaluations('predictive_accuracy', id=run_ids, output_format='dataframe', per_fold=False)
    layout = html.Div([
        dcc.Dropdown(
            id = 'dropdown-study',
            options = [
                {'label':'mean-value', 'value':'0'},
                {'label':'folded', 'value':'1'}
            ],
            value = '0'
        ),
        html.Div(id='scatterplot-study'),
    ])
    return layout


def get_layout_from_suite(suite_id):
    """
    params:
    study_id: study id provided
    outpus:
    scatter plot for runs and studies combined
    """
    # items = study.get_study(int(study_id))
    # run_ids = items.runs[1:300]
    # item = evaluations.list_evaluations('predictive_accuracy', id=run_ids, output_format='dataframe', per_fold=False)
    layout = html.Div([
        html.Div(id='distplot-suite'),
    ])
    return layout


def get_dataset_overview():
    """

    :return: overview of datasets page
    """
    df = datasets.list_datasets(output_format='dataframe')
    df.dropna(inplace=True)
    bins_1 = [1, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, max(df["NumberOfInstances"])]
    bins_2 = [1, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]
    df["Number of instances"] = pd.cut(df["NumberOfInstances"], bins=bins_1).astype(str)
    df["Number of features"] = pd.cut(df["NumberOfFeatures"], bins=bins_2).astype(str)

    title = ["Number of instances across datasets",
             "Number of features across datasets",
             "Attribute Type percentage distribution",
             "Number of classes"]

    fig = plotly.subplots.make_subplots(rows=4, cols=1, subplot_titles=tuple(title))

    for col in ["Number of instances", "Number of features"]:
        df[col] = df[col].str.replace(',', ' -')
        df[col] = df[col].str.replace('(', "")
        df[col] = df[col].str.replace(']', "")
    df.sort_values(by="NumberOfInstances", inplace=True)
    showlegend = False
    fig.add_trace(
        go.Histogram(x=df["Number of instances"], showlegend=showlegend), row=1, col=1)

    df.sort_values(by="NumberOfFeatures", inplace=True)
    fig.add_trace(
        go.Histogram(x=df["Number of features"], showlegend=showlegend), row=2, col=1)

    df["Attribute Type"] = "mixed"
    df["Attribute Type"][df['NumberOfSymbolicFeatures'] <= 1] = 'numeric'
    df["Attribute Type"][df['NumberOfNumericFeatures'] == 0] = 'categorical'
    fig.add_trace(
        go.Histogram(x=df["Attribute Type"], histnorm="percent", showlegend=showlegend), row=3, col=1)

    fig.add_trace(
        go.Violin(x=df["NumberOfClasses"], showlegend=showlegend, name="NumberOfClasses"), row=4, col=1)

    fig.update_layout(height=1000)
    fig.update_xaxes(tickfont=dict(size=10))

    return html.Div(dcc.Graph(figure=fig), style={"fontsize":10})


def get_task_overview():
    """

    :return: Overview page for all tasks on openml
    """
    df = tasks.list_tasks(output_format='dataframe')
    cols = ["task_type", "estimation_procedure"]
    title = ["Types of tasks on OpenML", "Estimation procedure across tasks"]

    fig = plotly.subplots.make_subplots(rows=2, cols=1, subplot_titles=tuple(title))
    i = 0
    for col in cols:
        i = i+1
        fig.add_trace(
        go.Histogram(x=df[col], showlegend=False), row=i, col=1)
    fig.update_layout(height=1000)

    return html.Div(dcc.Graph(figure=fig))


def get_flow_overview():
    """

    :return: overview page for flows
    """

    df = flows.list_flows(output_format='dataframe')
    count = pd.DataFrame(df["name"].value_counts()).reset_index()
    count.columns = ["name", "count"]
    count = count[0:1000]
    short = []
    for name in count["name"]:
        try:
            short.append(SklearnExtension.trim_flow_name(name))
        except:
            pass
    count["name"] = short
    fig = go.Figure(data=[go.Bar(y=count["name"].values, x=count["count"].values,
                                 marker=dict(color='blue',
                                             opacity=0.8),
                                 orientation="h")])
    fig.update_layout(
                      yaxis=dict(autorange="reversed"),
                      margin=dict(l=500),
                      title="",
                      height=700),

    return html.Div(dcc.Graph(figure=fig))


def get_run_overview():
    df = runs.list_runs(output_format='dataframe', size=10000)
    task_types = ["Supervised classification", "Supervised regression", "Learning curve",
                  "Supervised data stream classification", "Clustering",
                  "Machine Learning Challenge",
                  "Survival Analysis", "Subgroup Discovery"]

    count = pd.DataFrame(df["task_type"].value_counts()).reset_index()
    count.columns = ["name", "count"]
    count["percent"] = (count["count"]/count["count"].sum())*100
    count["name"] = [task_types[i] for i in count["name"].values]
    data = [go.Bar(x=count["name"].values, y=count["percent"].values,
                   )]
    fig = go.Figure(data=data)
    fig.update_layout(yaxis=dict(
        title='Percentage(%)'))

    return dcc.Graph(figure=fig)
