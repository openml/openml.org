import plotly
import plotly.graph_objs as go

from .helpers import *
from .dashapp import *

from openml import runs, flows, datasets, tasks
from openml.extensions.sklearn import SklearnExtension
from dash.dependencies import Input, Output, State
font = ["Nunito Sans", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"',
        "Arial", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"']


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
    fig.update_layout(height=1000, width=900)

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
                      title="", width=900,
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
    fig.update_layout(width=900, yaxis=dict(
        title='Percentage(%)'))

    return dcc.Graph(figure=fig)


def register_overview_callbacks(app):
    @app.callback(Output('data_overview', 'children'),
                  [Input('status_data','value')])
    def dataset_overview(radio):
        """

        :return: overview of datasets page
        """
        if radio == 'active':
            df = datasets.list_datasets(output_format='dataframe')

        else:
            df = datasets.list_datasets(output_format='dataframe', status='all')

        df.dropna(inplace=True)

        # Binning
        bins_1 = [1, 500, 1000, 5000, 10000, 50000, 100000, 500000, max(df["NumberOfInstances"])]
        bins_2 = [1, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]
        df["Number of instances"] = pd.cut(df["NumberOfInstances"], bins=bins_1, precision=0).astype(str)
        df["Number of features"] = pd.cut(df["NumberOfFeatures"], bins=bins_2, precision=0).astype(str)
        for col in ["Number of instances", "Number of features"]:
            df[col] = df[col].str.replace(',', ' -')
            df[col] = df[col].str.replace('(', "")
            df[col] = df[col].str.replace(']', "")
            df[col] = df[col].str.replace('.0', " ", regex=False)

        title = ["Attribute Types",
                 "Number of classes",
                 "Number of instances across datasets",
                 "Number of features across datasets",

                 ]

        # Attribute types
        df["Attribute Type"] = "mixed"
        df["Attribute Type"][df['NumberOfSymbolicFeatures'] <= 1] = 'numeric'
        df["Attribute Type"][df['NumberOfNumericFeatures'] == 0] = 'categorical'
        grouped = (df.groupby("Attribute Type").size().reset_index(name='counts'))
        colors = ['gold', 'mediumturquoise', 'darkorange', 'lightgreen']
        types_chart = go.Pie(labels=grouped["Attribute Type"], values=grouped['counts'],
                             marker=dict(colors=colors),
                             showlegend=True)
        fig1 = go.Figure(data=[types_chart])
        fig1.update_layout(height=400)

        # No of classes
        showlegend = False
        classes_plot = go.Violin(y=df["NumberOfClasses"], showlegend=showlegend,
                                 box_visible=True,
                                 fillcolor='mediumpurple',
                                 meanline_visible=True,
                                 name=' '
                                 )
        fig2 = go.Figure(data=[classes_plot])
        fig2.update_xaxes(tickfont=dict(size=10))
        fig2.update_layout(height=400)

        # Instances plot
        df.sort_values(by="NumberOfInstances", inplace=True)

        instances_plot = go.Histogram(x=df["Number of instances"], marker_color='#EB89B5',

                                      showlegend=showlegend)
        fig3 = go.Figure(data=[instances_plot], )
        fig3.update_layout(bargap=0.4, width=900, height=400)
        fig3.update_xaxes(tickfont=dict(size=10))

        # Features plot
        df.sort_values(by="NumberOfFeatures", inplace=True)
        features_plot = go.Histogram(x=df["Number of features"], showlegend=showlegend)
        fig4 = go.Figure(data=[features_plot])
        fig4.update_layout(bargap=0.4, width=900, height=400)
        fig4.update_xaxes(tickfont=dict(size=10))

        return html.Div([html.Div([html.P(title[0]),
                                   dcc.Graph(figure=fig1)], className="row metric-row",
                                  style={'width': '48%','text-align': 'center',
                                         'display': 'inline-block',
                                         }),
                         html.Div([html.P(title[1]),
                                   dcc.Graph(figure=fig2)],className="row metric-row",
                                  style={'width': '48%', 'text-align': 'center',
                                         'display': 'inline-block'}),
                         html.P(title[2]),
                         dcc.Graph(figure=fig3),
                         html.P(title[3]),
                         dcc.Graph(figure=fig4)],
                        )


