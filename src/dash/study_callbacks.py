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
        item = openml.evaluations.list_evaluations('predictive_accuracy', id=runs, output_format='dataframe', )
        item_fold = openml.evaluations.list_evaluations('predictive_accuracy', id=runs, output_format='dataframe',
                                                        per_fold=True)
        if(value == '0'):
            fig = go.Figure(data=go.Scatter(x=item['value'], y=item['data_name'], mode='markers'))
        else:
            item_fold[['fold1', 'fold2', 'fold3', 'fold4', 'fold5', 'fold6', 'fold7', 'fold8', 'fold9',
                       'fold10']] = pd.DataFrame(item_fold['values'].values.tolist(), index=item_fold.index)
            fig = go.Figure()

            # Add traces
            fig.add_trace(go.Scatter(x=item_fold['fold1'], y=item_fold['data_name'],
                                     mode='markers',
                                     name='markers'))
            fig.add_trace(go.Scatter(x=item_fold['fold2'], y=item_fold['data_name'],
                                     mode='markers',
                                     name='s+markers'))
            fig.add_trace(go.Scatter(x=item_fold['fold3'], y=item_fold['data_name'],
                                     mode='markers',
                                     name='lines'))
            fig.add_trace(go.Scatter(x=item_fold['fold4'], y=item_fold['data_name'],
                                     mode='markers',
                                     name='lines'))
            fig.add_trace(go.Scatter(x=item_fold['fold5'], y=item_fold['data_name'],
                                     mode='markers',
                                     name='lines'))
            fig.add_trace(go.Scatter(x=item_fold['fold6'], y=item_fold['data_name'],
                                     mode='markers',
                                     name='lines'))
            fig.add_trace(go.Scatter(x=item_fold['fold7'], y=item_fold['data_name'],
                                     mode='markers',
                                     name='lines'))
            fig.add_trace(go.Scatter(x=item_fold['fold8'], y=item_fold['data_name'],
                                     mode='markers',
                                     name='lines'))
            fig.add_trace(go.Scatter(x=item_fold['fold9'], y=item_fold['data_name'],
                                     mode='markers',
                                     name='lines'))
            fig.add_trace(go.Scatter(x=item_fold['fold10'], y=item_fold['data_name'],
                                     mode='markers',
                                     name='lines'))
        graph = dcc.Graph(figure=fig)
        return html.Div(graph)

