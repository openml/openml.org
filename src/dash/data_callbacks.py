import plotly.graph_objs as go
from plotly import tools
from dash.dependencies import Input, Output, State
import dash_html_components as html
import plotly.figure_factory as ff
import dash_core_components as dcc
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from .helpers import *
import numpy as np
import time


def register_data_callbacks(app):
    @app.callback(
        Output('distribution', 'children'),
        [Input('intermediate-value', 'children'),
         Input('url', 'pathname'),
         Input('datatable', 'data'),
         Input('datatable', 'selected_rows'),
         Input('radio1', 'value')
         ])
    def distribution_plot(df_json, pathname, rows, selected_row_indices, radio1):
        """

        :param df_json: cached data
        :param pathname: url
        :param rows: rows of the feature table
        :param selected_row_indices: selected rows of the feature table
        :return: subplots containing violin plot or histogram for selected_row_indices
        """
        print(selected_row_indices)
        start = time.time()

        if '/dashboard/data' in pathname and df_json is not None:
            print('entered table update', radio1)
        else:
            return [], []
        # df = pd.read_json(df_json, orient='split')
        df = pd.read_pickle('df.pkl')

        dff = pd.DataFrame(rows)
        end = time.time()
        print("to get cached data it takes")
        print(end - start)
        target = dff[dff["Target"] == "true"]["Attribute"].values[0]
        target_type = (dff[dff["Target"] == "true"]["DataType"].values[0])
        attributes = []
        df.sort_values(by=target, inplace=True)
        print(df.head())

        if target_type == "numeric" and radio1 == "target":
            print(target_type)
        if radio1 == "target":

            if target_type == "numeric":
                df[target] = pd.cut(df[target], 200).astype(str)
                cat = df[target].str.extract('\((.*),', expand=False).astype(float)
                df['bin'] = pd.Series(cat)
                df.sort_values(by='bin', inplace=True)
            else:
                df.sort_values(by=target, inplace=True)
                df[target] = df[target].astype(str)
            target_vals = list(df[target].unique())
            print(target_vals)
        N = len(df[target].unique())
        color = ['hsl(' + str(h) + ',50%' + ',50%)' for h in np.linspace(0, 240, N)]
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
            fig = tools.make_subplots(rows=numplots, cols=1, subplot_titles=tuple(attributes))
            i = 0
            for attribute in attributes:
                if i == 0:
                    COLORBAR = True
                else:
                    COLORBAR = False

                if types[i] == "numeric":
                    if radio1 == "target":
                        data = [go.Histogram(x=sorted(sorted(df[attribute][df[target] == target_vals[i]])),
                                             name=str(target_vals[i]),
                                             nbinsx=20, histfunc="count", showlegend=COLORBAR,
                                             marker=dict(color=color[i],
                                                         cmin=0,
                                                         showscale=False,
                                                         colorbar=dict(thickness=20,
                                                                       tickvals=color,
                                                                       ticktext=target_vals
                                                                       ))) for i in range(int(N))]
                        i = i + 1
                        for trace in data:
                            fig.append_trace(trace, i, 1)
                    else:
                        trace1 = {
                            "type": 'violin',
                            "showlegend": False,
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
                            "fillcolor": 'steelblue',
                            "name": "",
                            "opacity": 0.6,
                            # "x0": attribute
                        }
                        i = i + 1
                        fig.append_trace(trace1, i, 1)
                else:
                    if radio1 == "target":
                        data = [go.Histogram(x=sorted(df[attribute][df[target] == target_vals[i]]),
                                             name=str(target_vals[i]),
                                             showlegend=COLORBAR,
                                             marker=dict(color=color[i],
                                                         cmin=0,
                                                         showscale=False,
                                                         colorbar=dict(thickness=20,
                                                                       tickvals=color,
                                                                       ticktext=target_vals))) for i in range(int(N))]
                        i = i + 1
                        for trace in data:
                            fig.append_trace(trace, i, 1)
                    else:
                        i = i + 1
                        trace1 = go.Histogram(x=sorted(df[attribute]), name=attribute, showlegend=False,
                                              marker=dict(color='steelblue'))
                        fig.append_trace(trace1, i, 1)

        fig['layout'].update(hovermode='closest', height=300 + (len(attributes) * 100),barmode='stack')  # barmode='stack')
        return html.Div(dcc.Graph(figure=fig))

    @app.callback(
        [Output('fi', 'children'),
         Output('matrix', 'children')],
        [Input('intermediate-value', 'children'),
         Input('url', 'pathname'),
         Input('datatable', 'data'),
         Input('radio', 'value')
         ])
    def feature_importance(df_json, pathname, rows, radio):
        if df_json is not None and '/dashboard/data' in pathname:
            # df = pd.read_json(df_json, orient='split')
            df = pd.read_pickle('df.pkl')
        else:
            return [], []


        start = time.time()
        dff = pd.DataFrame(rows)
        target_attribute = dff[dff["Target"] == "true"]["Attribute"].values[0]
        target_type = (dff[dff["Target"] == "true"]["DataType"].values[0])
        from category_encoders.target_encoder import TargetEncoder
        x = df.drop(target_attribute, axis=1)
        te = TargetEncoder()
        if target_type == "nominal":
            y = pd.Categorical(df[target_attribute]).codes
            x = te.fit_transform(x, y)

            x = clean_dataset(x)
            rf = RandomForestClassifier(n_estimators=10, n_jobs=-1)
            rf.fit(x, y)
        else:
            y = df[target_attribute]
            x = te.fit_transform(x, y)
            x = clean_dataset(x)
            rf = RandomForestRegressor(n_estimators=10, n_jobs=-1)
            rf.fit(x, y)
        end = time.time()
        print("Random forest takes ", end - start)

        fi = pd.DataFrame(rf.feature_importances_, index=x.columns, columns=['importance'])
        fi = fi.sort_values('importance', ascending=False).reset_index()
        trace = go.Bar(y=fi['index'], x=fi['importance'], name='fi', orientation='h')
        layout = go.Layout(title="RandomForest feature importance", autosize=False,
                           margin=dict(l=500), width=1200, hovermode='closest')
        figure = go.Figure(data=[trace], layout=layout)


        C = 'Portland'

        numericals = list(dff["Attribute"][dff["DataType"] == "numeric"])
        nominals = list(dff["Attribute"][dff["DataType"] == "nominal"])



        top_numericals = (fi['index'][fi['index'].isin(numericals)][:5])
        top_nominals = (fi['index'][fi['index'].isin(nominals)][:5])
        df['target'] = df[target_attribute]
        if target_type == "numeric":
            top_features = df[fi['index'][0:5].values]
            df['target'] = y
            df['target'] = pd.cut(df['target'], 200).astype(str)
            cat = df['target'].str.extract('\((.*),', expand=False).astype(float)
            df['bin'] = pd.Series(cat)
            df.sort_values(by='bin', inplace=True)
            df.drop('bin', axis=1, inplace=True)
        else:
            try:
                df['target'] = df['target'].astype(int)
            except:
                pass

            df.sort_values(by='target', inplace=True)

        if radio == "top":
            top_features = df[fi['index'][0:5].values]
            top_features['target'] = df['target']

            if len(top_numericals):

                matrix = ff.create_scatterplotmatrix(top_features, title='Top feature interactions', diag='box',
                                                     index='target',
                                                     colormap=C, colormap_type='seq', height=1200, width=1500)
                graph = dcc.Graph(figure=matrix)


            else:
                d = top_features
                parcats = [go.Parcats(
                    dimensions=[
                        {'label': column,
                         'values': list(d[column].values)} for column in d.columns],
                    line={'color': y,
                          'colorscale': C},
                    hoveron='color',
                    hoverinfo='count+probability',
                    arrangement='freeform'
                )]
                layout = go.Layout(autosize=False, width=1200, height=800)

                fig = go.Figure(data=parcats, layout=layout)
                graph = dcc.Graph(figure=fig)


        elif radio == "numeric":
            if len(top_numericals):
                print(top_numericals)
                df_num = df[top_numericals]
                df_num['target'] = df['target']
                matrix = ff.create_scatterplotmatrix(df_num, title='Top numeric feature interactions', diag='box',
                                                     index='target',
                                                     colormap=C, colormap_type='seq', height=1200, width=1500)
                graph = dcc.Graph(figure=matrix)
            else:
                graph = html.P("No numericals found")
        elif radio == "nominal":
            if len(top_nominals):
                print(top_nominals)
                df_nom = df[top_nominals]
                df_nom['target'] = df['target']

                parcats = [go.Parcats(
                    dimensions=[
                        {'label': column,
                         'values': list(df_nom[column].values)} for column in df_nom.columns],
                    line={'color': pd.Categorical(df_nom['target']).codes,
                          'colorscale': C},
                    hoveron='color',
                    hoverinfo='count+probability',
                    arrangement='freeform'
                )]
                layout = go.Layout(autosize=False, width=1200, height=800)
                fig = go.Figure(data=parcats, layout=layout)
                graph = dcc.Graph(figure=fig)
            else:
                graph = html.P("No nominals found")

        return html.Div(dcc.Graph(figure=figure)), html.Div(graph)

    @app.callback(Output('scatter_plot', 'children'), [
        Input('intermediate-value', 'children'),
        Input('url', 'pathname'),
        Input('dropdown1', 'value'),
        Input('dropdown2', 'value'),
        Input('dropdown3', 'value'), ])
    def update_scatter_plot(df_json, pathname, at1, at2, colorCode):
        """

        :param df_json: json
            df cached by render_layout callback
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
        if at1 is not None and at2 is not None and '/dashboard/data' in pathname:
            print('entered scatter plot')
        else:
            return []

        if df_json is None:
            return []
        # df = pd.read_json(df_json, orient='split')
        df = pd.read_pickle('df.pkl')
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
                height=800, width=1200
            )}
        return html.Div(dcc.Graph(figure=fig))
