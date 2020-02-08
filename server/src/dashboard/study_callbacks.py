import plotly.graph_objs as go
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc
from dash.exceptions import PreventUpdate
from openml import OpenMLStudy

from .helpers import *
import re
import openml
import plotly.express as px


def register_study_callbacks(app, cache):
    @app.callback(
        [Output('graph-div', 'children'),
         Output('show-fold-checkbox', 'style')],
        [Input('url', 'pathname'),
         Input('graph-type-dropdown', 'value'),
         Input('metric-dropdown', 'value'),
         Input('show-fold-checkbox', 'value'),
         Input('dataset-table', "derived_virtual_data")]
    )
    def scatterplot_study(pathname, graph_type, metric, show_fold_checkbox, shown_table_rows):
        if shown_table_rows is None:
            # The first callback will have shown_table_rows set to None. It's a Dash thing.
            raise PreventUpdate

        with print_duration("Callback"):
            fig = go.Figure()
            show_folds = 'fold' in show_fold_checkbox
            study_id = int(re.search(r'study/run/(\d+)', pathname).group(1))

            study_results = load_run_data(study_id, metric, include_each_fold=show_folds, max_runs=300)
            # dataset_names = study_results['data_name'].unique()
            dataset_names = [row['name'] for row in shown_table_rows]
            dataset_ids = [row['did'] for row in shown_table_rows]
            dataset_link_map = {dataset: create_link_html(dataset, dataset_id)
                                for dataset, dataset_id in zip(dataset_names, dataset_ids)}

            n_flows = study_results['flow_name'].nunique()

            if graph_type == 'parallel':
                for flow_name, flow_df in study_results.groupby('flow_name'):
                    shared_template = (f'{metric}: ' + '%{y}<br>'
                                       f'Flow: {flow_name}<br>'
                                       '%{text}<br>'
                                       '<extra></extra>')  # Removes a second box with trace information

                    # Connecting the results with lines also interpolates over missing values,
                    # to stop this behavior we add explicit NaNs for datasets without results.
                    # There are more efficient ways to do this, but we'll optimize this when we need to (curr: 1ms).
                    scores = []
                    for dataset_name in dataset_names:
                        for (score, data_name) in zip(flow_df['value'], flow_df['data_name']):
                            if dataset_name == data_name:
                                scores.append(score)
                                break
                        else:
                            scores.append(float('nan'))

                    mean_text = [(f'Dataset: {dataset_name}<br>'
                                  'Mean score') for dataset_name in dataset_names]
                    fig.add_trace(go.Scatter(y=scores, x=dataset_names, mode='lines+markers',
                                             name=flow_name, text=mean_text, hovertemplate=shared_template))

                # Since `pd.Series.unique` returns in order of appearance, we can match it with the data_id blindly
                fig.update_xaxes(ticktext=list(dataset_link_map.values()), tickvals=dataset_names)
                fig.update_layout(
                    xaxis_title="Dataset",
                    yaxis_title=metric.replace('_', ' ').title()  # Perhaps an explicit mapping is better.
                )
            elif graph_type == 'scatter':
                # We map the datasets to a y-value, so we can vary flow y-values explicitly in the scatter plot.
                # Reversing dataset_names will visually match the order of datasets in the table.
                dataset_y_map = {dataset: i for i, dataset in enumerate(reversed(dataset_names))}
                dy_range = 0.6  # Flows will be scattered +/- `dy_range / 2` around the y value (datasets are 1. apart)
                dy = dy_range/(n_flows - 1)  # Distance between individual flows

                for i, (flow_name, flow_df) in enumerate(study_results.groupby('flow_name')):
                    flow_df = flow_df[flow_df['data_name'].isin(dataset_names)]
                    # See https://plot.ly/python/discrete-color/#color-sequences-in-plotly-express for color palettes
                    flow_color = px.colors.qualitative.Plotly[i]

                    shared_template = (f'{metric}: ' + '%{x}<br>'
                                       f'Flow: {flow_name}<br>'
                                       '%{text}<br>'
                                       '<extra></extra>')  # Removes a second box with trace information

                    y_offset = i * dy - dy_range / 2

                    if show_folds:
                        # Individual fold results:
                        data_per_point = [(score, row['data_name'], dataset_y_map[row['data_name']] + y_offset)
                                          for _, row in flow_df.iterrows() for score in row['values']]
                        scores, data_names, ys = zip(*data_per_point)

                        fold_text = [f'Dataset: {dataset_name}<br>Fold score' for dataset_name in data_names]
                        fold_trace = go.Scatter(x=scores, y=ys, mode='markers', name=f'{flow_name}_fold', opacity=0.5,
                                                legendgroup=flow_name, showlegend=False, marker=dict(color=flow_color),
                                                text=fold_text, hovertemplate=shared_template)
                        fig.add_trace(fold_trace)

                    ys = [dataset_y_map[dataset_name] + y_offset for dataset_name in flow_df['data_name']]
                    mean_text = [f'Dataset: {dataset_name}<br>Mean score' for dataset_name in flow_df['data_name']]
                    mean_trace = go.Scatter(x=flow_df['value'], y=ys, mode='markers', marker=dict(symbol='diamond', color=flow_color), legendgroup=flow_name, name=flow_name, text=mean_text, hovertemplate=shared_template)
                    fig.add_trace(mean_trace)

                fig.update_yaxes(
                    ticktext=[dataset_link_map[dataset_name] for dataset_name in dataset_y_map],
                    tickvals=list(dataset_y_map.values())
                )
                fig.update_layout(
                    xaxis_title=metric.replace('_', ' ').title(),  # Perhaps an explicit mapping is better.
                    yaxis_title="Dataset"
                )
            else:
                raise ValueError(f"`graph_type` must be one of 'scatter' or 'parallel', not {graph_type}.")

            per_task_height = 30
            height = len(dataset_names) * per_task_height
            print(height, len(dataset_names))
            fig.update_layout(
                #title="Flow vs task performance",
                legend_orientation='h',
                legend=dict(y=1.2),
                # legend_title='something'  Should work with plotly >= 4.5, but seems to fail silently.
                uirevision='some_constant',  # Keeps UI settings (e.g. zoom, trace filter) consistent on updates.
                font=dict(
                    family="Segoe UI Symbol",
                    size=14,
                    color="#7f7f7f"
                )
            )
            # Setting height is currently disabled. It messes with the page when filtering datasets.
            # However, the scatter plot *does* get rendered too small, so have to find a solution.
            graph = dcc.Graph(figure=fig)#, style={'height': f'{height}px'})
            checkbox_style = {'display': 'none' if graph_type == 'parallel' else 'block'}
        return html.Div(graph), checkbox_style


def load_run_data(study_id: int, metric: str, include_each_fold: bool, max_runs: int):
    """ Loads the results of the first `max_runs` runs of the specified study. Optionally with results per fold. """
    study = openml.study.get_study(study_id)
    runs = study.runs[:max_runs]
    df = openml.evaluations.list_evaluations(metric, run=runs, output_format='dataframe', per_fold=include_each_fold)

    if include_each_fold:
        df['value'] = df['values'].apply(np.mean)
    return df


def create_link_html(data_name: str, dataset_id: str, character_limit: int = 15) -> str:
    """ Return a html hyperlink (<a>) to the dataset page, text is shortened to `character_limit` chars. """
    short_name = data_name if len(data_name) <= character_limit else f"{data_name[:character_limit - 3]}..."
    return f"<a href='/search?type=data&id={dataset_id}'>{short_name}</a>"
