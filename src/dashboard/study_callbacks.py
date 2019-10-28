import plotly.graph_objs as go
from plotly import tools
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc
from .helpers import *
import pandas as pd
from sklearn.preprocessing import label_binarize
from scipy.io import arff
import urllib.request
import io
import re
import openml


def register_study_callbacks(app):

    print('calling register')

    @app.callback(
        Output('scatterplot-study', 'children'),
        [Input('url', 'pathname'),
         Input('dropdown-study', 'value'),
         ]
    )
    def scatterplot_study(pathname, value):
        print('calling or not')
        print(value)
        study_id = int(re.search('study/(\d+)', pathname).group(1))
        study = openml.study.get_study(study_id)
        runs = study.runs[1:300]
        print(len(study.runs))

        item = openml.evaluations.list_evaluations('predictive_accuracy', run=runs, output_format='dataframe', )
        item_fold = openml.evaluations.list_evaluations('predictive_accuracy', run=runs, output_format='dataframe',
                                                        per_fold=True)
        if(value == '0'):
            fig = go.Figure(data=go.Scatter(x=item['value'], y=item['data_name'], mode='markers'))
        else:
            df = splitDataFrameList(item_fold, 'values')
            dfs = dict(tuple(df.groupby('flow_name')))
            key_list = list(dfs.keys())
            fig = go.Figure()
            for i in range(len(key_list)):
                curr_df = dfs[str(key_list[i])]
                fig.add_trace(go.Scatter(x=curr_df['values'], y=curr_df['data_name'],
                                         mode='markers', name=str(key_list[i])))

        graph = dcc.Graph(figure=fig)
        return html.Div(graph)

