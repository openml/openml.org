import dash_table as dt
from .helpers import *
from .dashapp import *
from openml import runs, evaluations, setups, datasets


def get_layout_from_data(data_id):
    """

    :param data_id: dataset id
    :return:
     layout: custom layout for data visualization

    """
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
                     style_cell={'textAlign': 'left', 'backgroundColor': 'white', 'minWidth': '100px', 'width': '150px',
                                 'maxWidth': '300px', "fontFamily": font, 'textOverflow': 'ellipsis', "fontSize": 11},
                     style_table={'minHeight': '250px', 'maxHeight': '250px', 'overflowY': 'scroll'},
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
                             {'label': "Top four numeric feature interactions", "value": "numeric"},
                             {'label': "Top four nominal feature interactions", "value": "nominal"}],
                    value="top"

                ), ),
            dcc.Loading(html.Div(id='matrix')),
            html.Div(id='hidden', style={'display': 'none'})

        ])
    ])

    # Scatter plot
    scatter_plot = html.Div(id="tab3")
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
        mean = str(round(np.mean(np.array(values), axis=0), 3))
        std = str(round(np.std(np.array(values), axis=0), 3))
        result_list.append(values)
        error.append(mean+" \u00B1 "+std)
    df.drop(['results'], axis=1, inplace=True)
    df['results'] = result_list
    df['values'] = error
    d = df.drop(['results'], axis=1)

    # Define components of run layout
    run_title = html.H3('Run ' + str(run_id), style={'text-align': 'left', 'text-color': 'black'})
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
            id='dropdown-study',
            options=[
                {'label': 'mean-value', 'value': '0'},
                {'label': 'folded', 'value': '1'}
            ],
            value='0'
        ),
        dcc.RadioItems(
            id='graph',
            options=[{'label': i, 'value': i} for i in ['scatter', 'parallel-coordinate']],
            value='scatter',
            labelStyle={'display': 'inline-block'}
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
                       html.P('Choose whether active/all datasets are considered for overview plots',
                              style={'text-align': 'left', 'color': 'gray', 'fontSize': 11
                                     }
                              ),
                       radio_button,
                       graph], style={'overflowY':'hidden'})
    return layout


