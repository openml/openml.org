import plotly.graph_objs as go
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc
from .helpers import *
import re
import openml
import plotly.express as px


def register_study_callbacks(app):
    @app.callback(
        [Output('graph-div', 'children')],
        # Output('scatter-or-parallel-radio', 'style')],
        [Input('url', 'pathname'),
         Input('graph-type-dropdown', 'value'),
         Input('metric-dropdown', 'value')]
    )
    def scatterplot_study(pathname, graph_type, metric):
        fig = go.Figure()

        study_id = int(re.search(r'study/run/(\d+)', pathname).group(1))
        study = openml.study.get_study(study_id)
        runs = study.runs[1:300]
        print(len(study.runs), pathname)

        if graph_type == 'parallel':
            with print_duration('list_evaluations'):
                study_results = openml.evaluations.list_evaluations(metric, run=runs, output_format='dataframe')
            for flow_name, flow_df in study_results.groupby('flow_name'):
                fig.add_trace(go.Scatter(y=flow_df['value'], x=flow_df['data_name'],
                                         mode='lines+markers', name=flow_name))
        elif graph_type == 'scatter':
            with print_duration('list_evaluations_per_fold'):
                study_results = openml.evaluations.list_evaluations(metric, run=runs, output_format='dataframe', per_fold=True)
            with print_duration('split'):
                df = splitDataFrameList(study_results, 'values')
            dataset_names = df['data_name'].unique()

            # We map the datasets to a y-value, so we can vary flow y-values explicitly in the scatter plot.
            dataset_y_map = {dataset: i for i, dataset in enumerate(dataset_names)}
            n_flows = df['flow_name'].nunique()
            dy_range = 0.6  # Flows will be scattered +/- `dy_range / 2` around the y value (datasets are 1. apart)
            dy = dy_range/(n_flows - 1)  # Distance between individual flows

            for i, (flow_name, flow_df) in enumerate(df.groupby('flow_name')):
                # See https://plot.ly/python/discrete-color/#color-sequences-in-plotly-express for color palettes
                flow_color = px.colors.qualitative.Plotly[i]
                y_offset = i * dy - dy_range / 2
                # Individual fold results:
                y_folds = [dataset_y_map[d] + y_offset for d in flow_df['data_name']]
                fold_trace = go.Scatter(x=flow_df['values'], y=y_folds, mode='markers', name=f'{flow_name}_fold',
                                        opacity=0.5, legendgroup=flow_name, showlegend=False, marker=dict(color=flow_color))
                fig.add_trace(fold_trace)
                # Mean performance:
                flow_mean_df = flow_df.groupby('data_name', as_index=False).mean()
                y_mean = [dataset_y_map[d] + y_offset for d in flow_mean_df['data_name']]
                mean_trace = go.Scatter(x=flow_mean_df['values'], y=y_mean, mode='markers', marker=dict(symbol='diamond', color=flow_color), legendgroup=flow_name, name=flow_name)
                fig.add_trace(mean_trace)

            def create_link_html(data_name: str, dataset_id: str, character_limit: int = 15) -> str:
                """ Return a html hyperlink (<a>) to the dataset page, text is shortened to `character_limit` chars. """
                short_name = data_name if len(data_name) <= character_limit else f"{data_name[:character_limit - 3]}..."
                return f"<a href='/search?type=data&id={dataset_id}'>{short_name}</a>"

            # Since `pd.Series.unique` returns in order of appearance, we can match it with the data_id blindly
            dataset_link_map = {dataset: create_link_html(dataset, dataset_id)
                                for dataset, dataset_id in zip(dataset_names, df['data_id'].unique())}
            fig.update_yaxes(ticktext=list(dataset_link_map.values()), tickvals=list(dataset_y_map.values()))
        else:
            raise ValueError(f"`graph_type` must be one of 'scatter' or 'parallel', not {graph_type}.")

        per_task_height = 30
        height = len(study_results['data_name'].unique()) * per_task_height
        print(height, len(study_results['data_name'].unique()))
        fig.update_layout(
            title="Flow vs task performance",
            xaxis_title=metric.replace('_', ' ').title(),  # Perhaps an explicit mapping is better.
            yaxis_title="Dataset",
            legend_orientation='h',
            # legend_title='something'  Should work with plotly >= 4.5, but seems to fail silently.
            font=dict(
                size=11,
                color="#7f7f7f"
            )
        )
        graph = dcc.Graph(figure=fig, style={'height': f'{height}px'})
        return [html.Div(graph)] # , show_graph_radio
