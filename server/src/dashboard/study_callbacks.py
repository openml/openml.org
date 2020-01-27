import plotly.graph_objs as go
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc
from .helpers import *
import re
import openml


def register_study_callbacks(app):
    @app.callback(
        Output('scatterplot-study', 'children'),
        [Input('url', 'pathname'),
         Input('dropdown-study', 'value'),
         Input('graph', 'value'),
         ]
    )
    def scatterplot_study(pathname, value, graph_type):
        metric = 'predictive_accuracy'
        fig = go.Figure()
        print(value)

        study_id = int(re.search(r'study/run/(\d+)', pathname).group(1))
        study = openml.study.get_study(study_id)
        runs = study.runs[1:300]
        print(len(study.runs))

        if value == 'mean':
            study_results = openml.evaluations.list_evaluations(metric, run=runs, output_format='dataframe')
            dfs = tuple(study_results.groupby('flow_name'))
            for flow_name, flow_df in dfs:
                if graph_type == 'scatter':
                    fig.add_trace(go.Scatter(x=flow_df['value'], y=flow_df['data_name'],
                                             mode='markers', name=flow_name))
                elif graph_type == 'parallel-coordinate':
                    fig.add_trace(go.Scatter(y=flow_df['value'], x=flow_df['data_name'], mode='lines+markers',
                                             name=str(flow_name)))
        elif value == 'fold':
            study_results = openml.evaluations.list_evaluations(metric, run=runs, output_format='dataframe', per_fold=True)
            df = splitDataFrameList(study_results, 'values')
            dfs = tuple(df.groupby('flow_name'))
            for flow_name, flow_df in dfs:
                fig.add_trace(go.Scatter(x=flow_df['values'], y=flow_df['data_name'],
                                         mode='markers', name=flow_name))
        else:
            raise ValueError(f"`value` must be one of 'mean' or 'folds', not {value}.")

        per_task_height = 30
        height = len(study_results['data_name'].unique()) * per_task_height
        print(height, len(study_results['data_name'].unique()))
        fig.update_layout(
            title="Flow vs task performance",
            xaxis_title=metric.replace('_', ' ').title(),  # Perhaps an explicit mapping is better.
            yaxis_title="Dataset",
            legend_orientation="h",
            font=dict(
                size=11,
                color="#7f7f7f"
            )
        )
        graph = dcc.Graph(figure=fig, style={'height': f'{height}px'})
        return html.Div(graph)
