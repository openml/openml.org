import os
from typing import List, Tuple
import dash_table as dt
from openml import runs, evaluations, setups, datasets, study
from .helpers import get_run_df, get_metadata, logger
import dash_core_components as dcc
import dash_html_components as html

# TODO: Move to assets (Copied from Joaquin's react font)
font = ["Nunito Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI",
        "Roboto", "Helvetica Neue",
        "Arial", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"]


def get_layout_from_data(data_id):
    # Get data and metadata
    metadata, data, name = get_metadata(data_id)
    selected_rows = list(range(0, 5))
    if metadata.shape[0] < 5:
        selected_rows = list(range(0, metadata.shape[0]))

    # Define layout components
    logger.debug("loading skeleton layout and table")
    # Feature table
    feature_table = html.Div(
        dt.DataTable(data=metadata.to_dict('records'),
                     columns=[{"name": i, "id": i} for i in metadata.columns],
                     row_selectable="multi",
                     sort_action="native",
                     row_deletable=False,
                     selected_rows=selected_rows,
                     filter_action="native",
                     id='datatable',
                     style_header={'backgroundColor': 'white', 'fontWeight': 'bold'},
                     style_cell={'textAlign': 'left', 'backgroundColor': 'white',
                                 'minWidth': '100px', 'width': '150px',
                                 'maxWidth': '300px', "fontFamily": font,
                                 'textOverflow': 'ellipsis', "fontSize": 11},
                     style_table={'minHeight': '250px', 'maxHeight': '250px',
                                  'overflowY': 'scroll'},
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
                     ), className="twelve columns"
    )

    # Distribution plot
    table_graph = dcc.Loading(html.Div(id='table-graph', className="twelve columns"))
    subplot_graph = dcc.Loading(html.Div(
                id='distribution', style={'overflowY': 'scroll', 'width': '100%',
                                          'height': '400px'}))
    dist_plot = html.Div([
        html.P(''),
        html.P('Choose if the color code is based on target or not',
               style={'text-align': 'left', 'color': 'gray', 'fontSize': 11
                      }
               ),
        html.Div(
            dcc.RadioItems(
                id='radio1',
                options=[{'label': "Target based distribution", "value": "target"},
                         {'label': "Individual distribution", "value": "solo"}],
                value="solo",
                labelStyle={'display': 'inline-block', 'text-align': 'justify', 'fontSize': 11}

            )),
        html.Div(
            dcc.RadioItems(
                id='stack',
                value='group',
                labelStyle={'display': 'inline-block', 'text-align': 'justify', 'fontSize': 11}
            )),
        table_graph,

    ],
    )

    # Feature importance
    feature_importance = html.Div(id='Feature Importance',
                                  children=[html.H3('RandomForest Feature Importance'),
                                            dcc.Loading(html.Div(id='fi'))])

    # Feature Interaction
    feature_interaction = html.Div(id="tab2", children=[
        html.Div([
            html.H3('Feature Interactions'),
            html.Div(
                dcc.RadioItems(
                    id='radio',
                    options=[{'label': "Top four feature interactions", "value": "top"},
                             {'label': "Top four numeric feature interactions",
                              "value": "numeric"},
                             {'label': "Top four nominal feature interactions",
                              "value": "nominal"}],
                    value="top"

                ), ),
            dcc.Loading(html.Div(id='matrix')),
            html.Div(id='hidden', style={'display': 'none'})

        ])
    ])

    # Scatter plot
    scatter_plot = html.Div(id="scatterdiv")
    # Define layout using components
    layout = html.Div(children=[
        html.H3(name+' dataset', style={'text-align': 'left', 'text-color': 'black'}),
        html.P('Choose one or more attributes for distribution plot (first 1k attributes listed)',
               style={'text-align': 'left', 'color': 'gray','fontSize': 11
                      }),

        feature_table,
        dist_plot,
        feature_importance,
        feature_interaction,
        scatter_plot,
        html.Div(id='tableloaded', children="table", style={'display': 'none'}),
        html.Div(id='dataloaded', style={'display': 'none'})

    ], className='container', style={'overflowY': 'hidden'}),
    logger.debug("loaded skeleton layout and table")
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
    # Metrics dropdown
    measures = (evaluations.list_evaluation_measures())
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
    # Fetch more runs button
    fetch_runs_button = html.Div(html.Button('Fetch next 100 runs', id='button',
                                 style={'fontSize': 14,
                                        'color': 'black',
                                        'width': '20',
                                        'height': '30',
                                        'background-color': 'white'}))
    # Graphs
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
    # Define components of flow layout
    # Metric dropdown
    measures = (evaluations.list_evaluation_measures())
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
    # Task type dropdown
    task_types = ["Supervised classification", "Supervised regression", "Learning curve",
                  "Supervised data stream classification", "Clustering",
                  "Machine Learning Challenge",
                  "Survival Analysis", "Subgroup Discovery"]

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
    # parameters dropdown
    setup_list = setups.list_setups(flow=flow_id, size=1, output_format='dataframe')
    parameter_dict = setup_list['parameters'].values[0]
    parameters = [param['full_name'] for key, param in parameter_dict.items()]
    parameters.append('None')
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
    # Flow evaluations plot
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
    run, df = get_run_df(int(run_id))
    # Define components of run layout
    # Run table
    run_title = html.H3('Run ' + str(run_id), style={'text-align': 'left', 'text-color': 'black'})

    table_data = df.drop(['results'], axis=1)

    run_table = html.Div(
               dt.DataTable(
                   data=table_data.to_dict('records'),
                   columns=[{"name": i, "id": i} for i in table_data.columns],
                   row_selectable="multi",
                   sort_action="native",
                   row_deletable=False,
                   selected_rows=[0, 1, 2],
                   style_header={
                       'backgroundColor': 'white',
                       'fontWeight': 'bold'
                   },

                   style_cell={'textAlign': 'left', 'backgroundColor': 'white',
                               'minWidth': '50px', 'width': '150px', 'maxWidth': '300px',
                               'textOverflow': 'ellipsis', "fontSize": 11,
                               "fontFamily": font
                               },
                   style_table={
                       'minHeight': '420px',
                       'maxHeight': '420px',
                       'overflowY': 'scroll',
                       'border': 'thin lightgrey solid'
                   },
                   id='runtable'),  style={'width': '45%', 'display': 'inline-block',
                                           'position': 'relative'}
           )

    # Distribution plot
    run_plot = html.Div(
        id='runplot',
        style={'width': '50%', 'display': 'inline-block', 'overflowY': 'scroll', 'height': '400px',
               'position': 'absolute'}
    )
    # PR and ROC plot
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
    return layout


def get_layout_from_study(study_id):
    """ Generate the layout for the study dashboard. Data content (graphs, tables)
    is generated through callbacks.

    study_id: id of the study to generate the dashboard for.
    returns: a html.Div element with child elements containing all UI elements
    and parent divs for data content.
    """
    # Results may be shown in aggregate (mean of folds), or per-fold:
    graph_type_dropdown = dcc.Dropdown(
        id='graph-type-dropdown',
        options=[
            {'label': 'Show scatter plot of results', 'value': 'scatter'},
            {'label': 'Show parallel line plot of results', 'value': 'parallel'}
        ],
        value='scatter'
    )

    # We construct the metric dropdown menu dynamically from computed metrics.
    # Simply listing all metrics (evaluations.list_evaluation_measures)
    # might include metrics that are not recorded.
    this_study = study.get_study(int(study_id))
    first_run = runs.get_run(this_study.runs[0])
    # The full list of metrics contain 'prior' metrics, which are not
    # dependent on models but on the given dataset.
    # Moreover some metrics don't make sense as a metric
    # (I think there are more, but I don't understand all 'metrics'):
    illegal_metrics = ['number_of_instances', 'os_information']
    metrics = [metric for metric in first_run.evaluations if metric not in illegal_metrics
               and 'prior' not in metric]
    if 'predictive_accuracy' in metrics:
        default_metric = 'predictive_accuracy'
    elif 'root_mean_squared_error' in metrics:
        default_metric = 'root_mean_squared_error'
    else:
        default_metric = metrics[0]

    metric_dropdown = dcc.Dropdown(
        id='metric-dropdown',
        options=[{'label': metric.replace('_', ' ').title(), 'value': metric}
                 for metric in metrics],
        value=default_metric
    )

    show_fold_checkbox = dcc.Checklist(
        id='show-fold-checkbox',
        options=[{'label': 'Show results for each fold (can be slow)', 'value': 'fold'}],
        value=[]
    )
    dataset_table = create_dataset_overview_table(
        id_='dataset-table',
        dataset_ids=this_study.data,
        columns=[
            ('Name', 'name'),
            ('Instances', 'NumberOfInstances'),
            ('Features', 'NumberOfFeatures'),
            ('Classes', 'NumberOfClasses'),  # Should only be included for studies with classification tasks.
            ('Missing Values', 'NumberOfMissingValues'),
            ('Numeric Features', 'NumberOfNumericFeatures'),
            ('Categorical Features', 'NumberOfSymbolicFeatures')
        ]
    )
    layout = html.Div([
        graph_type_dropdown,
        metric_dropdown,
        show_fold_checkbox,
        html.Div(id='graph-div'),
        dataset_table
    ])
    return layout


def create_dataset_overview_table(id_: str, dataset_ids: List[int],
                                  columns: List[Tuple[str, str]]) -> dt.DataTable:
    """ Download dataset qualities for the given datasets and
    populate a DataTable with this information. """
    datas = datasets.get_datasets(dataset_ids, download_data=False)
    # You might want to filter out all but the shown data,
    # as the unshown data is also sent (but keep did for reference)
    qualities = [{**data.qualities, 'name': data.name, 'did': data.dataset_id} for data in datas]
    columns = [{"name": column_name, "id": quality_name} for column_name, quality_name in columns]
    return dt.DataTable(
        id=id_,
        columns=columns,
        tooltip={'name': 'This is the name of the dataset given by the uploader.'},
        data=qualities,
        filter_action="native",
        sort_action="native",
        style_as_list_view=True,  # Removes vertical grid lines
        style_cell={'font-family': 'Segoe UI Symbol'},  # 'fontSize': 12
        style_cell_conditional=[{'if': {'column_id': 'name'}, 'textAlign': 'left'}],
        style_data_conditional=[{'if': {'row_index': 'odd'},
                                 'backgroundColor': 'rgb(252, 252, 252)'}],
        style_header={'backgroundColor': 'rgb(230, 230, 230)', 'fontWeight': 'bold'}
    )


def get_layout_from_suite(suite_id):
    """
    params:
    study_id: study id provided
    outpus:
    scatter plot for runs and studies combined
    """
    # layout = html.Div([
    #     html.Div(id='distplot-suite'),
    # ])
    d = datasets.get_dataset(1, download_data=False)
    key_list = list(d.qualities.keys())
    layout = html.Div([
        html.Div([

            html.Div([
                dcc.Dropdown(
                    id='xaxis-column',
                    options=[{'label': i, 'value': i} for i in key_list],
                    value='NumberOfInstances'
                ),
                dcc.RadioItems(
                    id='xaxis-type',
                    options=[{'label': i, 'value': i} for i in ['linear', 'log']],
                    value='linear',
                    labelStyle={'display': 'inline-block'}
                )
            ],
                style={'width': '48%', 'display': 'inline-block'}),

            html.Div([
                dcc.Dropdown(
                    id='yaxis-column',
                    options=[{'label': i, 'value': i} for i in key_list],
                    value='NumberOfFeatures'
                ),
                dcc.RadioItems(
                    id='yaxis-type',
                    options=[{'label': i, 'value': i} for i in ['linear', 'log']],
                    value='linear',
                    labelStyle={'display': 'inline-block'}
                )
            ], style={'width': '48%', 'float': 'right', 'display': 'inline-block'})
        ]),

        html.Div(id='suite-scatter-plot'),
        html.Div([
            dcc.Dropdown(
                id='xaxis-hist',
                options=[{'label': i, 'value': i} for i in key_list],
                value='NumberOfInstances'
            )
        ]),
        html.Div(id='suite-histogram')
    ])

    return layout


def get_layout_dataset_overview():
    radio_button = html.Div(
            dcc.RadioItems(
                id='status_data',
                options=[{'label': "Active datasets", "value": "active"},
                         {'label': "All datasets", "value": "all"}],
                value="active",
                labelStyle={'display': 'inline-block', 'text-align': 'justify', 'fontSize': 11}

            ))

    graph = html.Div(id='data_overview', className="twelve columns")
    layout = html.Div([html.H3('Overview of datasets on OpenML'),
                       html.P('Choose whether active/all '
                              'datasets are considered for overview plots',
                              style={'text-align': 'left', 'color': 'gray', 'fontSize': 11
                                     }
                              ),
                       radio_button,
                       graph], style={'overflowY':'hidden'})
    return layout


def get_run_overview():
    graph = html.Div(id='run_overview', className="twelve columns")
    radio_button = html.Div(
            dcc.RadioItems(
                id='run_size',
                options=[{'label': "10K runs", "value": 10000},
                         {'label': "100K runs", "value": 100000},
                         {'label': "500K runs", "value": 500000}],
                value=10000,
                labelStyle={'display': 'inline-block', 'text-align': 'justify', 'fontSize': 11}

            ))
    run_loader = dcc.Loading(html.Div(id='loader', style={'display': 'none'}),type='dot')

    layout = html.Div([run_loader,
                       graph,
                       radio_button],
                      style={'overflowY': 'hidden'})
    return layout


def get_task_overview():
    graph = html.Div(id='task_overview', className="twelve columns")
    radio_button = html.Div(
            dcc.RadioItems(
                id='task_size',
                options=[{'label': "10K runs", "value": 10000},
                         {'label': "100K runs", "value": 100000},
                         {'label': "500K runs", "value": 500000}],
                value=10000,
                labelStyle={'display': 'inline-block', 'text-align': 'justify', 'fontSize': 11}

            ), style={'display': 'none'})
    task_loader = dcc.Loading(html.Div(id='tloader', style={'display': 'none'}), type='dot')

    layout = html.Div([task_loader,
                       graph,
                       radio_button],
                      style={'overflowY': 'hidden'})
    return layout
