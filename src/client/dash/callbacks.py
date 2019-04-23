import plotly.graph_objs as go
import pandas as pd
import re
from .layouts import get_graph_from_data
from plotly import tools
from pandas.api.types import is_numeric_dtype
from dash.dependencies import Input, Output, State
import dash_html_components as html


def register_callbacks(app):
    """
    Registers the callbacks of the given dash app app
    :param app: Dash application

    """

    @app.callback([Output('page-content', 'children'),
                   Output('intermediate-value', 'children')],
                  [Input('url', 'pathname')])
    def display_page(pathname):
        """
        Main callback invoked when a URL with a data ID is entered.
        :param: pathname: str
            The URL entered, typically consists of dashboard/data/dataID.
        :return: page-content: dash layout
            The page layout with feature table and graphs
        :return: intermediate-value: json
            Cached df in json format for sharing between callbacks
        """
        df = pd.DataFrame()
        if pathname is not None and '/dashboard/data' in pathname:
            id = max(int(re.search(r'\d+', pathname).group()), 1)
            layout, df = get_graph_from_data(id, app)
            out = df.to_json(date_format='iso', orient='split')
            return layout, out
        else:
            index_page = html.Div([
                html.H1('Welcome to dash dashboard'),
            ])
            out = df.to_json(date_format='iso', orient='split')
            return index_page, out

    @app.callback(
        Output('graph-gapminder', 'figure'),
        [Input('intermediate-value', 'children'),
         Input('url', 'pathname'),
         Input('datatable-gapminder', 'rows'),
         Input('datatable-gapminder', 'selected_row_indices')])
    def update_figure(df_json, pathname, rows, selected_row_indices):
        """
        :param df_json: json
            df cached by display_page callback in json format
        :param pathname: str
            URL pathname entered
        :param rows: list
            rows of the displayed dash table
        :param selected_row_indices: list
            user-selected rows of the dash table
        :return: fig
            Figure with plots of selected features
        """
        if pathname is not None and '/dashboard/data' in pathname:
            print('entered table update')
        else:
            return
        if df_json is None:
            return
        df = pd.read_json(df_json, orient='split')
        dff = pd.DataFrame(rows)
        attributes = []
        if len(selected_row_indices) != 0:
            dff = dff.loc[selected_row_indices]
            #print(dff.head())
            attributes = dff["Attribute"].values
        if len(attributes) == 0:
            fig = tools.make_subplots(rows=1, cols=1)
            trace1 = go.Scatter(x=[0, 0, 0], y=[0, 0, 0])
            fig.append_trace(trace1, 1, 1)
        else:
            numplots = len(attributes)
            fig = tools.make_subplots(rows=numplots, cols=1)
            i = 1
            for attribute in attributes:
                if is_numeric_dtype(df[attribute]):
                    trace1 = {
                        "type": 'violin',
                        "x": df[attribute],
                        "box": {
                            "visible": True
                        },
                        "line": {
                            "color": 'black'
                        },
                        "meanline": {
                            "visible": True
                        },
                        "fillcolor": '#8dd3c7',
                        "opacity": 0.6,
                        "x0": attribute
                    }
                else:
                    trace1 = go.Histogram(x=sorted(df[attribute]))
                fig.append_trace(trace1, i, 1)
                i = i+1
        fig['layout'].update(title='Distribution Subplots')
        return fig

    @app.callback(Output('scatterPlotGraph', 'figure'), [
        Input('intermediate-value', 'children'),
        Input('url', 'pathname'),
        Input('dualVariableDropdownNum1', 'value'),
        Input('dualVariableDropdownNum2', 'value'),
        Input('dualVariableDropdownNom', 'value'), ])
    def update_dualVariableGraph(df_json, pathname, at1, at2, colorCode):
        """

        :param df_json: json
            df cached by display_page callback
        :param pathname: str
            url pathname entered
        :param at1: str
            selected attribute 1 from dropdown list
        :param at2: str
            selected attribute 2 from dropdown list
        :param colorCode: str
            selected categorical attribute
        :return:
            fig : Scatter plot of selected attributes
        """
        if pathname is not None and '/dashboard/data' in pathname:
            print('entered scatter plot')
        else:
            return

        if df_json is None:
            return
        df = pd.read_json(df_json, orient='split')
        fig = {
            'data': [go.Scatter(
                x=df[df[colorCode] == col][at1],
                y=df[df[colorCode] == col][at2],
                mode='markers',
                marker={
                    'size': 15,
                    'line': {'width': 0.5, 'color': 'white'}
                },
                name=col,
            ) for col in set(df[colorCode])],
            'layout': go.Layout(
                xaxis={'title': at1, 'autorange': True},
                yaxis={'title': at2, 'autorange': True},
                hovermode='closest',
            )}
        return fig
