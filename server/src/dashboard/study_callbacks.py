import plotly.graph_objs as go
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc
from .helpers import *
import re
import openml
import time


def register_study_callbacks(app):
    @app.callback(
        [Output('graph-div', 'children'),
         Output('scatter-or-parallel-radio', 'style')],
        [Input('url', 'pathname'),
         Input('mean-or-fold-dropdown', 'value'),
         Input('scatter-or-parallel-radio', 'value'),
         Input('metric-dropdown', 'value')]
    )
    def scatterplot_study(pathname, value, graph_type, metric):
        fig = go.Figure()
        print(value)

        study_id = int(re.search(r'study/run/(\d+)', pathname).group(1))
        study = openml.study.get_study(study_id)
        runs = study.runs[1:300]
        print(len(study.runs))

        if value == 'mean':
            study_results = openml.evaluations.list_evaluations(metric, run=runs, output_format='dataframe')
            for flow_name, flow_df in study_results.groupby('flow_name'):
                if graph_type == 'scatter':
                    fig.add_trace(go.Scatter(x=flow_df['value'], y=flow_df['data_name'],
                                             mode='markers', name=flow_name))
                elif graph_type == 'parallel-coordinate':
                    fig.add_trace(go.Scatter(y=flow_df['value'], x=flow_df['data_name'], mode='lines+markers',
                                             name=str(flow_name)))
        elif value == 'fold':
            study_results = openml.evaluations.list_evaluations(metric, run=runs, output_format='dataframe', per_fold=True)
            start = time.time()
            df = splitDataFrameList(study_results, 'values')
            print(time.time() - start, "seconds for split")

            dataset_map = {dataset: i for i, dataset in enumerate(df['data_name'].unique())}
            n_flows = df['flow_name'].nunique()
            dy_range = 0.6  # Flows will be scattered +/- `dy_range / 2` around the y value (datasets are 1. apart)
            dy = dy_range/(n_flows - 1)  # Distance between individual flows

            for i, (flow_name, flow_df) in enumerate(df.groupby('flow_name')):
                y_offset = i * dy - dy_range / 2
                ys = [dataset_map[d] + y_offset for d in flow_df['data_name']]
                fig.add_trace(go.Scatter(x=flow_df['values'], y=ys, mode='markers', name=flow_name, opacity=0.75))
            fig.update_yaxes(ticktext=list(dataset_map), tickvals=list(dataset_map.values()))
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
        show_graph_radio = {'display': 'block' if (value == 'mean') else 'none'}
        return html.Div(graph), show_graph_radio
