import plotly.graph_objs as go
import pandas as pd
import re
from .layouts import get_graph_from_data, get_layout_from_task, get_layout_from_flow
from plotly import tools
from dash.dependencies import Input, Output, State
import dash_html_components as html
import plotly.figure_factory as ff
import dash_core_components as dcc
from openml import datasets, tasks, runs, flows, config, evaluations, study
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from numpy import array

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
            The page layout with tables and graphs
        :return: intermediate-value: json
            Cached df in json format for sharing between callbacks
        """
        df = pd.DataFrame()
        if pathname is not None and '/dashboard/data' in pathname:
            id = int(re.search('data/(\d+)', pathname).group(1))
            layout, df = get_graph_from_data(id, app)
            out = df.to_json(date_format='iso', orient='split')
            return layout, out
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
         Input('datatable-gapminder', 'selected_row_indices'),
         ])
    def update_data_plots(df_json, pathname, rows, selected_row_indices):
        """
        Updates distribution based on selected attributes from the table
        Updates scatter matrix plot,if two or more attributes are chosen
        from the table.
        :param df_json: json
            df cached by render_layout callback in json format
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
        else:
            return [],[]
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

        fig['layout'].update(title=go.layout.Title(text='Distribution plots'),hovermode='closest')
        return fig

    @app.callback(
        Output('matrix', 'children'),
        [Input('intermediate-value', 'children'),
         Input('url', 'pathname'),
         Input('datatable-gapminder', 'rows'),
         Input('datatable-gapminder', 'selected_row_indices'),
         ])
    def update_scattermatrix(df_json, pathname, rows, selected_row_indices):
        """
        Updates distribution based on selected attributes from the table
        Updates scatter matrix plot,if two or more attributes are chosen
        from the table.
        :param df_json: json
            df cached by render_layout callback in json format
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
        else:
            return [], []
        if df_json is None:
            dff = pd.DataFrame()
            df = pd.DataFrame()
        else:
            df = pd.read_json(df_json, orient='split')
            dff = pd.DataFrame(rows)
            target_attribute = dff[dff["Target"] == "true"]["Attribute"].values[0]
            target_type = (dff[dff["Target"] == "true"]["DataType"].values[0])
            if target_type=="nominal":
                from category_encoders.target_encoder import TargetEncoder
                x= df.drop(target_attribute,axis=1)
                y = df[target_attribute]
                te = TargetEncoder()
                out = te.fit_transform(x,y)
                x = out.drop("numerical_target", axis=1)
                y = out["numerical_target"]
                print(out.columns)
                print(out.head())
                rf = RandomForestClassifier()
                rf.fit(x,y)
                print(rf.feature_importances_)

        attributes = []
        if len(selected_row_indices) != 0:
            dff = dff.loc[selected_row_indices]
            attributes = dff["Attribute"].values

        if(len(attributes)>1):
            df_scatter = df[attributes]
            df_scatter[target_attribute] = df[target_attribute]
            matrix = ff.create_scatterplotmatrix(df_scatter, diag='box',index= target_attribute,
                                          colormap='Portland', colormap_type='seq', height=800, width=1500)
        else:
            # return an empty fig
            matrix = go.Scatter(x=[0, 0, 0], y=[0, 0, 0])
        return html.Div(dcc.Graph(figure=matrix))

    @app.callback(Output('scatterPlotGraph', 'children'), [
        Input('intermediate-value', 'children'),
        Input('url', 'pathname'),
        Input('dualVariableDropdownNum1', 'value'),
        Input('dualVariableDropdownNum2', 'value'),
        Input('dualVariableDropdownNom', 'value'), ])
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
        if pathname is not None and '/dashboard/data' in pathname:
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
            )}
        return html.Div(dcc.Graph(figure=fig))

    @app.callback([Output('tab1', 'children'),
        Output('tab2', 'children')],
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
        eval_objects = evaluations.list_evaluations(function=metric, task=[int(task_id)])
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
        return html.Div(dcc.Graph(figure=fig)), html.Div(dcc.Graph(figure=fig1))

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
        evals = evaluations.list_evaluations(function=metric, flow=[flow_id])
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