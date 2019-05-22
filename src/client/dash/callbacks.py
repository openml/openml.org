import plotly.graph_objs as go
import pandas as pd
import re
from .layouts import get_layout_from_data, get_layout_from_task, get_layout_from_flow, get_layout_from_run
from plotly import tools
from dash.dependencies import Input, Output, State
import dash_html_components as html
import plotly.figure_factory as ff
import dash_core_components as dcc
from openml import datasets, tasks, runs, flows, config, evaluations, study
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
import numpy as np
import dash_table_experiments as dt
def register_callbacks(app):
    """
    Registers the callbacks of the given dash app app
    :param app: Dash application

    """

    @app.callback([Output('page-content', 'children'),
                   Output('intermediate-value', 'children')],
                  [Input('url', 'pathname')])
    def render_layout(pathname):
        """
        Main callback invoked when a URL with a data or task ID is entered.
        :param: pathname: str
            The URL entered, typically consists of dashboard/data/dataID or
            dashboard/task/ID
        :return: page-content: dash layout
                 basic layout
        :return: intermediate-value: json
            Cached df in json format for sharing between callbacks
        """
        df = pd.DataFrame()
        if pathname is not None and '/dashboard/data' in pathname:
            id = int(re.search('data/(\d+)', pathname).group(1))
            layout, df = get_layout_from_data(id, app)
            cache = df.to_json(date_format='iso', orient='split')
            return layout, cache
        elif pathname is not None and 'dashboard/task' in pathname:
            id = int(re.search('task/(\d+)', pathname).group(1))
            layout, taskdf = get_layout_from_task(id, app)
            out = taskdf.to_json(date_format='iso', orient='split')
            return layout, out
        elif pathname is not None and 'dashboard/flow' in pathname:
            id = int(re.search('flow/(\d+)', pathname).group(1))
            layout, flowdf = get_layout_from_flow(id,app)
            out = flowdf.to_json(date_format='iso', orient='split')
            return layout, out
        elif pathname is not None and 'dashboard/run' in pathname:
            id = int(re.search('run/(\d+)', pathname).group(1))
            layout, rundf = get_layout_from_run(id, app)
            out = rundf.to_json(date_format='iso', orient='split')
            return layout, out
        else:
            index_page = html.Div([
                html.H1('Welcome to dash dashboard'),
            ])
            out = df.to_json(date_format='iso', orient='split')
            return index_page, out

    @app.callback(
        Output('distribution', 'children'),
        [Input('intermediate-value', 'children'),
         Input('url', 'pathname'),
         Input('datatable', 'rows'),
         Input('datatable', 'selected_row_indices'),
         ])
    def distribution_plot(df_json, pathname, rows, selected_row_indices):
        """

        :param df_json: cached data
        :param pathname: url
        :param rows: rows of the feature table
        :param selected_row_indices: selected rows of the feature table
        :return: subplots containing violin plot or histogram for selected_row_indices
        """

        if '/dashboard/data' in pathname and df_json is not None:
            print('entered table update')
        else:
            return [], []
        df = pd.read_json(df_json, orient='split')
        dff = pd.DataFrame(rows)
        target = dff[dff["Target"]== "true"]["Attribute"].values[0]
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
                    data=[go.Histogram(x=sorted(df[attribute][df[target] == i]), name=i)
                                           for i in set(df[target])]
                    i = i + 1
                    for trace in data:
                        fig.append_trace(trace, i, 1)

                else:
                    data=[go.Histogram(x=sorted(df[attribute][df[target] == i]), name=i)
                                           for i in set(df[target])]
                    i = i + 1
                    for trace in data:
                        fig.append_trace(trace, i, 1)


        fig['layout'].update(hovermode='closest')
        return html.Div(dcc.Graph(figure=fig))

    @app.callback(
        [Output('fi', 'children'),
         Output('matrix', 'children')],
        [Input('intermediate-value', 'children'),
         Input('url', 'pathname'),
         Input('datatable', 'rows')
         ])
    def feature_importance(df_json, pathname, rows):
        if df_json is not None and '/dashboard/data' in pathname:
            df = pd.read_json(df_json, orient='split')
        else:
            return [],[]
        dff = pd.DataFrame(rows)
        target_attribute = dff[dff["Target"] == "true"]["Attribute"].values[0]
        target_type = (dff[dff["Target"] == "true"]["DataType"].values[0])
        from category_encoders.target_encoder import TargetEncoder
        x = df.drop(target_attribute, axis=1)
        te = TargetEncoder()
        if target_type == "nominal":
            y = pd.Categorical(df[target_attribute]).codes
            x = te.fit_transform(x, y)
            rf = RandomForestClassifier()
            rf.fit(x, y)
        else:
            y = df[target_attribute]
            x = te.fit_transform(x, y)
            rf = RandomForestRegressor()
            rf.fit(x, y)
        fi = pd.DataFrame(rf.feature_importances_, index=x.columns, columns=['importance'])
        fi = fi.sort_values('importance', ascending=False).reset_index()
        trace = go.Bar(y=fi['index'], x=fi['importance'], name='fi', orientation='h')
        layout = go.Layout(title="RandomForest feature importance", autosize=False,
                           margin=dict(l=500), width=1200, hovermode='closest')
        figure = go.Figure(data=[trace], layout=layout)
        df_imp = df[fi['index'][0:5].values]
        df_imp['target'] = df[target_attribute]
        numeric = 0
        for attribute in df_imp.columns:
            dtype = (dff[dff["Attribute"]==attribute]["DataType"].values)
            if "numeric" in dtype:
                numeric = 1
                break
            else:
                numeric = 0
        if numeric == 1:
            matrix = ff.create_scatterplotmatrix(df_imp, title='Scatter matrix top 5 features', diag='box',
                                                     index='target',
                                                     colormap='Portland', colormap_type='seq', height=1200, width=1500)
            graph = dcc.Graph(figure=matrix)
        else:
            d= df_imp
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
            fig = go.Figure(data=parcats)
            graph = dcc.Graph(figure=fig)
        return html.Div(dcc.Graph(figure=figure)),html.Div(graph)

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
                height=800, width=1200
            )}
        return html.Div(dcc.Graph(figure=fig))

    @app.callback([Output('tab1', 'children'),
        Output('tab2', 'children'),
       ],
        [Input('intermediate-value', 'children'),
        Input('url', 'pathname'),
        Input('metric', 'value') ])
    def update_task_plots(df_json, pathname, metric):
        """
        :param df_json: json
            task df cached by display_page callback
        :param pathname: str
            url pathname entered
        :return:
            fig : Scatter plot of top 100 flows for the selected function
        """
        if pathname is not None and '/dashboard/task' in pathname:
            print('entered task plot')
        else:
            return []
        # List of evaluations to dataframe.
        task_id = int(re.search('task/(\d+)', pathname).group(1))
        eval_objects = evaluations.list_evaluations(function=metric, task=[int(task_id)], size=10000)
        if not eval_objects:
            return []
        rows = []
        for id, e in eval_objects.items():
            rows.append(vars(e))
        df = pd.DataFrame(rows)
        # METHOD 1 of top 100 flows
        # Sort entire df, group by flow name, get 100 top runs in each group only for the first 100 groups
        top_runs = (df.sort_values('value', ascending=False).groupby(['flow_name'], sort=False).head(100))
        evals = top_runs[top_runs.groupby(['flow_name'], sort=False).ngroup() < 100]
        # Plot evals in ascending order
        evals = evals.sort_values(by=['value'], ascending=True)

        run_link = []
        tick_text = []
        uploader = []
        truncated = []

        for run_id in evals["run_id"].values:
            link = "<a href=\"https://www.openml.org/r/" + str(run_id) + "/\"> "
            run = runs.get_run(int(run_id), ignore_cache=False)
            uploader.append(run.uploader_name)
            run_link.append(link)

        for flow_id in evals["flow_id"].values:
            link = "<a href=\"https://www.openml.org/f/" + str(flow_id) + "/\">"
            tick_text.append(link)

        for flow in evals['flow_name'].values:
            truncated.append(flow[:50]+'..' if len(flow)>50 else flow)

        evals['flow_name_t'] = truncated
        data = [go.Scatter(y=evals["flow_name"],
                           x=evals["value"],
                           mode='text+markers',
                           text=run_link,
                           hovertext=evals['flow_name']+['<br>']*evals.shape[0]+evals["value"].astype(str)
                                     +['<br>']*evals.shape[0] + ['click for more info']*evals.shape[0],
                           hoverinfo='text',
                           #hoveron = 'points+fills',
                           hoverlabel=dict(bgcolor="white", bordercolor="black", namelength=-1),
                           marker=dict(opacity=0.5, symbol='diamond',
                                       color=evals["run_id"],  # set color equal to a variable
                                       colorscale='Earth', )
                           )
                ]
        layout = go.Layout(autosize=False, margin=dict(l=400), width=1500, height=evals.shape[0],hovermode='closest',
                           yaxis=go.layout.YAxis(
                               ticktext=tick_text + evals["flow_name_t"], tickvals=evals["flow_name"]
                           ))
        fig = go.Figure(data, layout)

        # FIG 2
        evals['upload_time'] = pd.to_datetime(evals['upload_time'])
        evals['upload_time'] = evals['upload_time'].dt.date
        evals['uploader'] = uploader
        from sklearn import preprocessing
        le = preprocessing.LabelEncoder()
        evals['uploader_id'] = le.fit_transform(evals['uploader'])
        data = [go.Scatter(y=evals["value"],
                           x=evals["upload_time"],
                           mode='text+markers',
                           text=run_link,
                           hovertext=evals["uploader"],
                           hoverlabel=dict(bgcolor="white", bordercolor="black"),
                           marker=dict(opacity=0.5, symbol='diamond',
                                       color=evals["uploader_id"],  # set color equal to a variable
                                       colorscale='Earth', )
                           )
                ]
        layout = go.Layout(
            autosize=False, width=1200, height=600, margin=dict(l=500),hovermode='closest',
            xaxis=go.layout.XAxis(showgrid=False),
            yaxis=go.layout.YAxis(showgrid=True,
                                  title=go.layout.yaxis.Title(text=str(metric)),
                                  ticktext=tick_text + evals["flow_name"],
                                  showticklabels=True))
        fig1 = go.Figure(data, layout)
        #TABLE
        top_uploader = (evals.sort_values('value', ascending=False).groupby(['uploader'], sort=False))
        name = top_uploader['uploader'].unique()
        rank = list(range(1, len(name) + 1))
        entries = top_uploader['uploader'].value_counts().values
        leaderboard = pd.DataFrame({'Rank': rank, 'Name': name, 'Entries': entries}).reset_index()
        leaderboard.drop('Name', axis=1, inplace=True)
        print(leaderboard)
        table =  html.Div(
            dt.DataTable(
                rows=leaderboard.to_dict('records'),
                columns=leaderboard.columns,
                column_widths=[200, 120, 120, 120],
                min_width=600,
                row_selectable=False,
                filterable=True,
                sortable=True,
                selected_row_indices=[],
                max_rows_in_viewport=15,
                id='tasktable',
            ),
        )
        return html.Div(dcc.Graph(figure=fig)), html.Div([dcc.Graph(figure=fig1), html.Div('Leaderboard'), table])

    @app.callback(Output('flowplot', 'figure'),
        [Input('intermediate-value', 'children'),
        Input('url', 'pathname'),
        Input('metric', 'value'),
        Input('tasktype', 'value'),
        Input('parameter', 'value'),])
    def update_flow_plots(df_json, pathname, metric, tasktype, parameter):
        """
        :param df_json: json
            task df cached by render_layout callback
        :param pathname: str
            url pathname entered
        :return:
            fig : Scatter plot
        """
        if pathname is not None and '/dashboard/flow' in pathname:
            print('entered flow plot')
        else:
            return []

        # Get all tasks of selected task type
        task_types = ["Supervised classification", "Supervised regression", "Learning curve",
                      "Supervised data stream classification", "Clustering",
                      "Machine Learning Challenge",
                      "Survival Analysis", "Subgroup Discovery"]
        TASK_TYPE_ID = task_types.index(tasktype)+1
        task_id = []
        tlist = tasks.list_tasks(task_type_id=TASK_TYPE_ID)
        for key, value in tlist.items():
            task_id.append(value['tid'])

        # Get all evaluations of given metric and flow id
        flow_id = int(re.search('flow/(\d+)', pathname).group(1))
        evals = evaluations.list_evaluations(function=metric, flow=[flow_id], size=10000)
        rows = []
        for id, e in evals.items():
            rows.append(vars(e))
        df = pd.DataFrame(rows)

        # Filter type of task
        df = df[df['task_id'].isin(task_id)]
        df.sort_values(by=['value'], ascending=False,inplace=True)
        run_link = []
        tick_text = []

        # Set clickable labels
        for run_id in df["run_id"].values:
            link = "<a href=\"https://www.openml.org/r/" + str(run_id) + "/\"> "
            run_link.append(link)

        for data_id in df["data_id"].values:
            link = "<a href=\"https://www.openml.org/d/" + str(data_id) + "/\">"
            tick_text.append(link)
        hover_text = []
        if parameter == 'None':
            color = [1] * 1000
            hover_text = df["value"]
            marker = dict(opacity=0.8, symbol='diamond',
                                       color=color,  # set color equal to a variable
                                       colorscale='Jet')
            print ('None')
        else:
            color = []
            for run_id in df.run_id[:1000]:
                p = pd.DataFrame(runs.get_runs([run_id])[0].parameter_settings)
                row = p[p['oml:name'] == parameter]
                if row.empty:
                    color.append('0')
                else:
                    color.append(row['oml:value'].values[0])
                    hover_text.append(row['oml:value'].values[0])


            if color[0].isdigit():
                print(color)
                color = list(map(int, color))
            else:
                color = pd.DataFrame(color)[0].astype('category').cat.codes
            marker = dict(opacity=0.8, symbol='diamond',
                          color=color,  # set color equal to a variable
                          colorscale='Jet', colorbar=dict(title='Colorbar'))
        data = [go.Scatter(x=df["value"][:1000],
                           y=df["data_name"][:1000],
                           mode='text+markers',
                           text=run_link,
                           hovertext=hover_text,
                           hoverlabel=dict(bgcolor="white", bordercolor="black"),
                           marker= marker )

                ]
        layout = go.Layout(hovermode='closest',
            autosize=False, width=1200, height=3000, margin=dict(l=500),
            xaxis=go.layout.XAxis(showgrid=False),
            yaxis=go.layout.YAxis(showgrid=True,
                                  ticktext=tick_text+df["data_name"],
                                  tickvals=df["data_name"],
                                  showticklabels=True))
        fig = go.Figure(data, layout)
        return fig


    @app.callback(
        Output('runplot', 'children'),
        [Input('intermediate-value', 'children'),
         Input('url', 'pathname'),
         Input('runtable', 'rows'),
         Input('runtable', 'selected_row_indices'),
         ])
    def run_plot(df_json, pathname, rows, selected_row_indices):
        """

        :param df_json: cached data
        :param pathname: url
        :param rows: rows of the feature table
        :param selected_row_indices: selected rows of the feature table
        :return: subplots containing violin plot or histogram for selected_row_indices
        """
        print('entered run update #1')

        if '/dashboard/run' in pathname and df_json is not None:
            print('entered run update')
        else:
            return [], []
        df = pd.read_json(df_json, orient='split')
        rows = pd.DataFrame(rows)

        if len(selected_row_indices) != 0:
            selected_rows = rows.loc[selected_row_indices]["evaluations"].values
            numplots = len(selected_rows)
            i = numplots
            fig = tools.make_subplots(rows=numplots, cols=1)
            for metric in selected_rows:
                measure = df.loc[df['evaluations'] == metric]
                x = measure['results'].values[0]
                trace1 = go.Box(
                x=x,
                name=metric)
                fig.append_trace(trace1,i,1)
                i = i-1
            fig['layout'].update(title = 'Cross-validation details (10-fold Crossvalidation)',hovermode='closest', height=numplots*200, margin=dict(l=200))
        else:
            fig = []

        return html.Div(dcc.Graph(figure=fig))


