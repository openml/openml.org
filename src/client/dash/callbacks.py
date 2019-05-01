import plotly.graph_objs as go
import pandas as pd
import re
from .layouts import get_graph_from_data, get_layout_from_task
from plotly import tools
from dash.dependencies import Input, Output, State
import dash_html_components as html
import plotly.figure_factory as ff
from openml import datasets, tasks, runs, flows, config, evaluations, study


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
        elif pathname is not None and 'dashboard/task' in pathname:
            id = max(int(re.search(r'\d+', pathname).group()), 1)
            layout, taskdf = get_layout_from_task(id, app)
            out = taskdf.to_json(date_format='iso', orient='split')
            return layout,out
        else:
            index_page = html.Div([
                html.H1('Welcome to dash dashboard'),
            ])
            out = df.to_json(date_format='iso', orient='split')
            return index_page, out

    @app.callback(
        [Output('graph-gapminder', 'figure'),
         Output('matrix', 'figure')],
        [Input('intermediate-value', 'children'),
         Input('url', 'pathname'),
         Input('datatable-gapminder', 'rows'),
         Input('datatable-gapminder', 'selected_row_indices'),
         ])
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
        :param colorCode: str
        :return: fig
            Figure with plots of selected features
        """
        if pathname is not None and '/dashboard/data' in pathname:
            print('entered table update')
        # else:
        #     return
        if df_json is None:
            dff = pd.DataFrame()
            df = pd.DataFrame()
        else:
            df = pd.read_json(df_json, orient='split')
            dff = pd.DataFrame(rows)
            target_attribute= dff[dff["Target"] == "true"]["Attribute"].values[0]
        attributes = []
        if len(selected_row_indices) != 0:
            dff = dff.loc[selected_row_indices]
            attributes = dff["Attribute"].values
            types = dff["DataType"].values
        if len(attributes) == 0:
            fig = tools.make_subplots(rows=1, cols=1)
            trace1 = go.Scatter(x=[0, 0, 0], y=[0, 0, 0])
            fig.append_trace(trace1, 1, 1)
        else:
            numplots = len(attributes)
            fig = tools.make_subplots(rows=numplots, cols=1)
            i = 0
            for attribute in attributes:
                if types[i]=="numeric":
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
                i = i+1
                fig.append_trace(trace1, i, 1)

        fig['layout'].update(title='Distribution Subplots')

        if(len(attributes)>1):
            df_scatter = df[attributes]
            df_scatter[target_attribute] = df[target_attribute]
            matrix = ff.create_scatterplotmatrix(df_scatter, diag='box',index= target_attribute,
                                          colormap='Portland', colormap_type='seq', height=800, width=800)
        else:
            # return an empty fig
            matrix = go.Scatter(x=[0, 0, 0], y=[0, 0, 0])
        return fig,matrix

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

    @app.callback(Output('taskplot', 'figure'),[
        Input('intermediate-value', 'children'),
        Input('url', 'pathname'),
        Input('metric', 'value'), ])
    def update_tasks(df_json, pathname, metric):
        """
        :param df_json: json
            task df cached by display_page callback
        :param pathname: str
            url pathname entered
        :return:
            fig : Scatter plot of top 50 flows for the selected function
        """
        if pathname is not None and '/dashboard/task' in pathname:
            print('entered task plot')
        else:
            return

        if df_json is None:
            return
        task_id = max(int(re.search(r'\d+', pathname).group()), 1)
        eval_objects = evaluations.list_evaluations(function=metric, task=str(task_id))
        rows = []
        for id, e in eval_objects.items():
            rows.append(vars(e))
        df = pd.DataFrame(rows)
        evals = df.sort_values(by=['value'], ascending=False)
        hover_text=[]
        tick_text =[]
        for flow_id in evals["flow_id"].values:
            link = "<a href=\"https://www.openml.org/f/" + str(flow_id) + "/\">"
            tick_text.append(link)
        for run_id in evals["run_id"].values:
            link = "<a href=\"https://www.openml.org/r/" + str(run_id) + "/\">."
            hover_text.append(link)
        data = [go.Scatter(y=evals["flow_name"][:100],
                           x=evals["value"][:100],
                           mode='text+markers',
                           text=hover_text,
                           marker=dict(color='rgb(0,0,255)', opacity=0.5),
                           )
                ]
        layout = go.Layout(autosize=False, width=1500, height=1000, margin=dict(l=400),
                           yaxis=go.layout.YAxis(
                               ticktext=tick_text + evals["flow_name"], tickvals=evals["flow_name"][:100]
                           ))
        fig = go.Figure(data, layout)
        return fig
