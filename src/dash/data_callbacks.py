import plotly.graph_objs as go
from plotly import tools
from dash.dependencies import Input, Output
import dash_html_components as html
import plotly.figure_factory as ff
import dash_core_components as dcc
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from .helpers import *
import numpy as np
import re
from random import shuffle

def register_data_callbacks(app):
    @app.callback(
        Output('distribution', 'children'),
        [Input('datatable', 'data'),
         Input('datatable', 'selected_rows'),
         Input('radio1', 'value'),
         Input('stack', 'value'),
         Input('url', 'pathname')
         ])
    def distribution_plot(rows, selected_row_indices, radio_value, stack, url):
        data_id = int(re.search('data/(\d+)', url).group(1))
        try:
            df = pd.read_pickle('cache/df'+str(data_id)+'.pkl')
        except OSError:
            return []

        meta_data = pd.DataFrame(rows)
        try:
            target = meta_data[meta_data["Target"] == "true"]["Attribute"].values[0]
            target_type = (meta_data[meta_data["Target"] == "true"]["DataType"].values[0])
        except IndexError:
            radio_value = "solo"


        if len(selected_row_indices) != 0:
            meta_data = meta_data.loc[selected_row_indices]
            attributes = meta_data["Attribute"].values
            types = meta_data["DataType"].values


        if radio_value == "target":
            # Bin numeric target
            df.sort_values(by=target, inplace=True)
            if target_type == "numeric":
                df[target] = pd.cut(df[target], 1000).astype(str)
                cat = df[target].str.extract('\((.*),', expand=False).astype(float)
                df['bin'] = pd.Series(cat)
                df.sort_values(by='bin', inplace=True)
            else:
                df.sort_values(by=target, inplace=True)
                df[target] = df[target].astype(str)
            target_vals = list(df[target].unique())
        if radio_value == "target":
            N = len(df[target].unique())
            color = ['hsl(' + str(h) + ',80%' + ',50%)' for h in np.linspace(0, 330, N)]

        if len(attributes) == 0:
            fig = tools.make_subplots(rows=1, cols=1)
            trace1 = go.Scatter(x=[0, 0, 0], y=[0, 0, 0])
            fig.append_trace(trace1, 1, 1)
        else:
            fig = tools.make_subplots(rows=len(attributes), cols=1, subplot_titles=tuple(attributes))
            i = 0
            for attribute in attributes:
                show_legend = True if i == 0 else False
                if types[i] == "numeric":
                    if radio_value == "target":
                        data = [go.Histogram(x=sorted(sorted(df[attribute][df[target] == target_vals[i]])),
                                             name=str(target_vals[i]),
                                             nbinsx=20, histfunc="count", showlegend=show_legend,
                                             marker=dict(color=color[i],
                                                         line=dict(
                                                             color=color[i],
                                                             width=1.5,
                                                         ),
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
                    if radio_value == "target":
                        data = [go.Histogram(x=sorted(df[attribute][df[target] == target_vals[i]]),
                                             name=str(target_vals[i]),
                                             showlegend=show_legend,
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

        fig['layout'].update(hovermode='closest', height=300 + (len(attributes) * 100), barmode=stack)
        return html.Div(dcc.Graph(figure=fig), id="graph1")

    @app.callback(
        [Output('fi', 'children'),
         Output('matrix', 'children')],
        [Input('datatable', 'data'),
         Input('radio', 'value'),
         Input('url', 'pathname')
         ])
    def feature_importance(rows, radio, url):
        data_id = int(re.search('data/(\d+)', url).group(1))
        try:
            df = pd.read_pickle('cache/df'+str(data_id)+'.pkl')
        except OSError:
            return []
        meta_data = pd.DataFrame(rows)
        try:
            target_attribute = meta_data[meta_data["Target"] == "true"]["Attribute"].values[0]
            target_type = (meta_data[meta_data["Target"] == "true"]["DataType"].values[0])
        except IndexError:
            return "No target found", "No target found"
        # Feature importance bar plot
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
        fi = pd.DataFrame(rf.feature_importances_, index=x.columns, columns=['importance'])
        fi = fi.sort_values('importance', ascending=False).reset_index()
        trace = go.Bar(y=fi['index'], x=fi['importance'], name='fi', orientation='h')
        layout = go.Layout(title="RandomForest feature importance", autosize=False,
                           margin=dict(l=500), width=1200, hovermode='closest')
        figure = go.Figure(data=[trace], layout=layout)

        # Feature interaction plots
        numerical_features = list(meta_data["Attribute"][meta_data["DataType"] == "numeric"])
        nominal_features = list(meta_data["Attribute"][meta_data["DataType"] == "nominal"])
        top_numericals = (fi['index'][fi['index'].isin(numerical_features)][:5])
        top_nominals = (fi['index'][fi['index'].isin(nominal_features)][:5])
        df['target'] = df[target_attribute]
        C = ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)',
             'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)'
             ]
        if target_type == "numeric" and radio == "nominal":
            cmap_type = 'seq'
            df['target'] = y
            df['target'] = pd.cut(df['target'], 1000).astype(str)
            cat = df['target'].str.extract('\((.*),', expand=False).astype(float)
            df['bin'] = pd.Series(cat)
            df.sort_values(by='bin', inplace=True)
            df.drop('bin', axis=1, inplace=True)


        else:
            cmap_type = 'cat'
            N = len(df['target'].unique())
            try:
                df['target'] = df['target'].astype(int)
            except ValueError:
                print("target not converted to int")
            df.sort_values(by='target', inplace=True)
            df['target'] = df['target'].astype(str)

        if radio == "top":
            top_features = df[fi['index'][0:5].values]
            top_features['target'] = df['target']

            if len(top_numericals):

                matrix = ff.create_scatterplotmatrix(top_features, title='Top feature interactions', diag='box',
                                                     index='target',
                                                     colormap_type=cmap_type,
                                                     colormap=C, height=1200, width=1500)
                graph = dcc.Graph(figure=matrix)
            else:
                d = top_features
                parcats = [go.Parcats(
                    dimensions=[
                        {'label': column,
                         'values': list(d[column].values)} for column in d.columns],
                    line={'color': y,
                          'colorscale': 'Portland'},
                    hoveron='color',
                    hoverinfo='count+probability',
                    arrangement='freeform'
                )]
                layout = go.Layout(autosize=False, width=1200, height=800)

                fig = go.Figure(data=parcats, layout=layout)
                graph = dcc.Graph(figure=fig)
        elif radio == "numeric":
            if len(top_numericals):
                df_num = df[top_numericals]
                df_num['target'] = df['target']
                matrix = ff.create_scatterplotmatrix(df_num, title='Top numeric feature interactions', diag='box',
                                                     index='target',
                                                     colormap=cmap_type, colormap_type='seq', height=1200, width=1500)
                graph = dcc.Graph(figure=matrix)
            else:
                graph = html.P("No numericals found")
        elif radio == "nominal":
            if len(top_nominals):
                df_nom = df[top_nominals]
                df_nom['target'] = df['target']

                parcats = [go.Parcats(
                    dimensions=[
                        {'label': column,
                         'values': list(df_nom[column].values)} for column in df_nom.columns],
                    line={'color': pd.Categorical(df_nom['target']).codes,
                          'colorscale': 'Portland'},
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
        Input('dropdown1', 'value'),
        Input('dropdown2', 'value'),
        Input('dropdown3', 'value'),
        Input('url', 'pathname')])
    def update_scatter_plot(at1, at2, colorCode,url):
        """

        :param at1: str
            selected attribute 1 from dropdown list
        :param at2: str
            selected attribute 2 from dropdown list
        :param colorCode: str
            selected categorical attribute
        :return:
            fig : Scatter plot of selected attributes
        """
        data_id = int(re.search('data/(\d+)', url).group(1))
        try:
            df = pd.read_pickle('cache/df'+str(data_id)+'.pkl')
        except OSError:
            return []
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
