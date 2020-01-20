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


def get_dataset_overview():
    """

    :return: overview of datasets page
    """
    df = datasets.list_datasets(output_format='dataframe')
    df.dropna(inplace=True)
    bins_1 = [1, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, max(df["NumberOfInstances"])]
    bins_2 = [1, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]
    df["Number of instances"] = pd.cut(df["NumberOfInstances"], bins=bins_1, precision=0).astype(str)
    df["Number of features"] = pd.cut(df["NumberOfFeatures"], bins=bins_2, precision=0).astype(str)

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