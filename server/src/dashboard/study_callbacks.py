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
         ]
    )
    def scatterplot_study(pathname, value):
        print(value)

        study_id = int(re.search('study/run/(\d+)', pathname).group(1))
        study = openml.study.get_study(study_id)
        runs = study.runs[1:300]
        print(len(study.runs))

        item = openml.evaluations.list_evaluations('predictive_accuracy', run=runs, output_format='dataframe', )
        item_fold = openml.evaluations.list_evaluations('predictive_accuracy', run=runs, output_format='dataframe',
                                                        per_fold=True)
        if(value == '0'):
            dfs = dict(tuple(item.groupby('flow_name')))
            key_list = list(dfs.keys())
            fig = go.Figure()
            for i in range(len(key_list)):
                curr_df = dfs[str(key_list[i])]
                fig.add_trace(go.Scatter(x=curr_df['value'], y=curr_df['data_name'],
                                         mode='markers', name=str(key_list[i])))


        else:

            df = splitDataFrameList(item_fold, 'values')
            dfs = dict(tuple(df.groupby('flow_name')))
            key_list = list(dfs.keys())
            fig = go.Figure()
            for i in range(len(key_list)):
                curr_df = dfs[str(key_list[i])]
                fig.add_trace(go.Scatter(x=curr_df['values'], y=curr_df['data_name'],
                                         mode='markers', name=str(key_list[i])))
        height = len(item['data_name'].unique()) * 30
        print(height, len(item['data_name'].unique()))
        fig.update_layout(
            title="Flow vs task performance",
            xaxis_title="Predictive accuracy",
            yaxis_title="Dataset",
            legend_orientation="h",
            font=dict(
                family="Courier New, monospace",
                size=10,
                color="#7f7f7f"
            )
        )
        graph = dcc.Graph(figure=fig, style={'height':str(height)+'px' })
        return html.Div(graph)

