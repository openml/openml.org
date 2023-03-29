import re

from dash import dcc
from dash import html
import numpy as np
import pandas as pd
import plotly.express as px

# from plotly.subplots import make_subplots

import plotly.graph_objs as go

from dash.dependencies import Input, Output, State
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

from .dash_config import DASH_CACHING
from .helpers import clean_dataset, get_data_metadata, logger, bin_numeric


TIMEOUT = 60 * 60 if DASH_CACHING else 1


def register_data_callbacks(app, cache):
    @app.callback(
        [
            Output("scatterdiv", "children"),
            Output("dataloaded", "value"),
            Output("datatable", "data"),
            Output("datatable", "columns"),
        ],
        [
            Input("url", "pathname"),
            Input("tableloaded", "children"),
        ],
        [State("datatable", "columns")],
    )
    @cache.memoize(timeout=TIMEOUT)
    def entropy_scatter(url, tableloaded, existing_columns):
        existing_columns.append({"id": "Entropy", "name": "Entropy"})
        logger.debug("Downloading data and calculate entropy")
        data_id = int(re.search(r"data/(\d+)", url).group(1))
        df, meta_features, numerical_data, nominal_data = get_data_metadata(data_id)
        scatter_div = (
            [
                html.Div(
                    [
                        html.H3("Scatter plot"),
                        html.Div(
                            dcc.Dropdown(
                                id="dropdown1",
                                options=[
                                    {"label": i, "value": i}
                                    for i in numerical_data[:1000]
                                ],
                                multi=False,
                                clearable=False,
                                value=numerical_data[0],
                            ),
                            style={"width": "30%"},
                        ),
                        html.Div(
                            dcc.Dropdown(
                                id="dropdown2",
                                options=[
                                    {"label": i, "value": i}
                                    for i in numerical_data[:1000]
                                ],
                                multi=False,
                                clearable=False,
                                value=numerical_data[1],
                            ),
                            style={"width": "30%"},
                        ),
                        html.Div(
                            dcc.Dropdown(
                                id="dropdown3",
                                options=[
                                    {"label": i, "value": i}
                                    for i in nominal_data[:1000]
                                ],
                                multi=False,
                                clearable=False,
                                value=nominal_data[0],
                            ),
                            style={"width": "30%"},
                        ),
                        html.Div(id="scatter_plot"),
                    ]
                )
            ]
            if len(numerical_data) > 1 and nominal_data
            else html.Div(
                id="Scatter Plot",
                children=[html.Div(html.P("No numerical-nominal combination found"))],
            )
        )

        logger.debug("Downloaded data and calculated entropy")
        return scatter_div, "loaded", meta_features.to_dict("records"), existing_columns

    # @app.callback(
    #     Output('distribution', 'children'),
    #     [Input('datatable', 'selected_rows'),
    #      Input('radio1', 'value'),
    #      Input('stack', 'value'),
    #      Input('url', 'pathname'),
    #      Input('dataloaded', 'value')],
    #     [State('datatable', 'data')])
    # def distribution_sub_plot(selected_row_indices, radio_value,
    #                           stack, url, data_loaded, rows):
    #     if data_loaded is None:
    #         return []
    #     data_id = int(re.search(r'data/(\d+)', url).group(1))
    #     try:
    #         df = pd.read_pickle('cache/df' + str(data_id) + '.pkl')
    #     except OSError:
    #         return []
    #     meta_data = pd.DataFrame(rows)
    #     print("distribution")
    #     if len(selected_row_indices) != 0:
    #         meta_data = meta_data.loc[selected_row_indices]
    #         attributes = meta_data["Attribute"].values
    #         types = meta_data["DataType"].values
    #
    #     if len(attributes) == 0:
    #         fig = make_subplots(rows=1, cols=1)
    #         trace1 = go.Scatter(x=[0, 0, 0], y=[0, 0, 0])
    #         fig.append_trace(trace1, 1, 1)
    #     else:
    #         fig = make_subplots(rows=len(attributes), cols=1,
    #                             subplot_titles=attributes,
    #                             )
    #         i = 0
    #         for attribute in attributes:
    #             show_legend = True if i == 0 else False
    #             data = dist_plot(meta_data, attribute, types[i],
    #                              radio_value, data_id, show_legend, df)
    #             i = i + 1
    #             for trace in data:
    #                 fig.append_trace(trace, i, 1)
    #
    #     fig['layout'].update(hovermode='closest',
    #                          height=300 + (len(attributes) * 100),
    #                          barmode=stack,
    #                          font=dict(size=11))
    #     for i in fig['layout']['annotations']:
    #         i['font']['size'] = 11
    #     #print(fig['layout'])
    #     return html.Div(dcc.Graph(figure=fig), id="graph1")

    @app.callback(
        Output("table-graph", "children"),
        [
            Input("datatable", "data"),
            Input("datatable", "selected_rows"),
            Input("url", "pathname"),
            Input("radio1", "value"),
            Input("stack", "value"),
            Input("dataloaded", "value"),
        ],
    )
    @cache.memoize(timeout=TIMEOUT)
    def plot_table(rows, selected_row_indices, url, radio, stack, dataloaded):
        # If dataset is not downloaded yet
        if dataloaded is None:
            return []

        logger.debug("loading pickle to create dist plot")

        # If pickle file is present
        data_id = int(re.search(r"data/(\d+)", url).group(1))
        try:
            df = pd.read_pickle("cache/df" + str(data_id) + ".pkl")
        except OSError:
            return []

        # Get selected rows from table
        meta_data = pd.DataFrame(rows)
        if len(selected_row_indices) != 0:
            meta_data = meta_data.loc[selected_row_indices]
        else:
            return "no selected rows"

        # Create distribution plots and align them as a table graph
        children = []
        for index, row in meta_data.iterrows():
            attribute = row["Attribute"]
            col1 = html.P(row["Attribute"])
            show_legend = True if index == 0 else False
            data = dist_plot(
                meta_data, attribute, row["DataType"], radio, data_id, show_legend, df
            )
            fig = go.Figure(data=data)
            fig["layout"].update(
                hovermode="closest", height=300, barmode=stack, font=dict(size=9)
            )
            col2 = dcc.Graph(figure=fig)
            children.append(generate_metric_row(col1, col2))

        out = html.Div(
            className="metric-rows",
            style={"overflowY": "scroll", "height": "500px", "marginBottom": "50px"},
            children=children,
        )
        logger.debug("distribution plot created")
        return out

    @app.callback(
        [Output("fi", "children"), Output("hidden", "value")],
        [Input("url", "pathname"), Input("dataloaded", "value")],
        [State("datatable", "data")],
    )
    @cache.memoize(timeout=TIMEOUT)
    def feature_importance(url, dataloaded, rows):
        # If dataset is not loaded
        if dataloaded is None:
            return [], "No file"

        # Get dataset if pickle exists
        data_id = int(re.search(r"data/(\d+)", url).group(1))
        try:
            df = pd.read_pickle("cache/df" + str(data_id) + ".pkl")
        except OSError:
            return [], "No file"

        # Get table of metadata
        meta_data = pd.DataFrame(rows)
        try:
            target_attribute = meta_data[meta_data["Target"] == "true"][
                "Attribute"
            ].values[0]
            target_type = meta_data[meta_data["Target"] == "true"]["DataType"].values[0]
        except IndexError:
            return "No target found", "No target found"

        # Feature importance bar plot
        from category_encoders.target_encoder import TargetEncoder

        x = df.drop(target_attribute, axis=1)
        y = df[target_attribute]

        te = TargetEncoder()
        if target_type == "nominal" or target_type == "string":
            y = pd.Categorical(y).codes
            x = clean_dataset(x)
            x = te.fit_transform(x, y)
            rf = RandomForestClassifier(n_estimators=10, n_jobs=-1)
            rf.fit(x, y)
        else:
            x = clean_dataset(x)
            x = te.fit_transform(x, y)
            rf = RandomForestRegressor(n_estimators=10, n_jobs=-1)
            rf.fit(x, y)

        fi = pd.DataFrame(
            rf.feature_importances_, index=x.columns, columns=["importance"]
        )
        fi = fi.sort_values("importance", ascending=False).reset_index()
        trace = go.Bar(y=fi["index"], x=fi["importance"], name="fi", orientation="h")
        layout = go.Layout(
            autosize=False, margin={"l": 100, "t": 0}, height=500, hovermode="closest"
        )
        figure = go.Figure(data=[trace], layout=layout)

        fi.to_pickle("cache/fi" + str(data_id) + ".pkl")

        return html.Div(dcc.Graph(figure=figure), className="twelve columns"), "done"

    @app.callback(
        Output("matrix", "children"),
        [Input("radio", "value"), Input("url", "pathname"), Input("hidden", "value")],
        [State("datatable", "data")],
    )
    @cache.memoize(timeout=TIMEOUT)
    def feature_interactions(radio, url, feat_importance, rows):
        data_id = int(re.search(r"data/(\d+)", url).group(1))
        if feat_importance == "done":
            df = pd.read_pickle("cache/df" + str(data_id) + ".pkl")
            fi = pd.read_pickle("cache/fi" + str(data_id) + ".pkl")
        else:
            return []

        # Get meta data
        meta_data = pd.DataFrame(rows)
        try:
            target_attribute = meta_data[meta_data["Target"] == "true"][
                "Attribute"
            ].values[0]
            target_type = meta_data[meta_data["Target"] == "true"]["DataType"].values[0]
        except IndexError:
            return "No target found", "No target found"

        if target_type == "nominal" or target_type == "string":
            y = pd.Categorical(df[target_attribute]).codes
        else:
            y = df[target_attribute]
        # Feature interaction plots
        df = clean_dataset(df)

        # Extract top nominal, top numeric features
        numerical_features = list(
            meta_data["Attribute"][meta_data["DataType"] == "numeric"]
        )
        nominal_features = list(
            meta_data["Attribute"][meta_data["DataType"] == "nominal"]
        )
        top_numericals = fi["index"][fi["index"].isin(numerical_features)][:4]
        top_nominals = fi["index"][fi["index"].isin(nominal_features)][:4]
        df["target"] = df[target_attribute]

        # Bin numeric target
        if target_type == "numeric":
            # cmap_type = 'seq'
            df["target_var"] = y
            df = bin_numeric(df, "target_var", "target")
            df.drop("bin", axis=1, inplace=True)
            df.drop("target_var", axis=1)
        else:
            # cmap_type = 'cat'
            try:
                df["target"] = df["target"].astype(int)
            except ValueError:
                logger.warning("target not converted to int")
            df.sort_values(by="target", inplace=True)
            df["target"] = df["target"].astype(str)

        # Radio - Display top features
        if radio == "top":
            top_features = df[fi["index"][0:4].values]
            top_features["target"] = df["target"]

            if len(top_numericals):
                px_mat = px.scatter_matrix(top_features, color="target", height=800)
                # C = ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)',
                # 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)']
                # N = len(df['target'].unique())
                # matrix = ff.create_scatterplotmatrix(top_features, diag='box',
                #                                      index='target',
                #                                      title="",
                #                                      #colormap=C,
                #                                      colormap_type=cmap_type,
                #
                #                                       height=800, width=900)
                px_mat.update_traces(diagonal_visible=False)

                graph = dcc.Graph(figure=px_mat)
            else:
                d = top_features
                parcats = [
                    go.Parcats(
                        dimensions=[
                            {"label": column, "values": list(d[column].values)}
                            for column in d.columns
                        ],
                        line={"color": y, "colorscale": "Portland"},
                        hoveron="color",
                        hoverinfo="count+probability",
                        arrangement="freeform",
                    )
                ]
                layout = go.Layout(autosize=False, height=800)

                fig = go.Figure(data=parcats, layout=layout)
                graph = dcc.Graph(figure=fig)
        elif radio == "numeric":  # Top numeric features
            if len(top_numericals):
                df_num = df[top_numericals]
                df_num["target"] = df["target"]
                px_mat = px.scatter_matrix(df_num, color="target", height=800)
                # matrix = ff.create_scatterplotmatrix(df_num,  diag='box', #'box'
                #                                      index='target',
                #                                      title="",
                #                                      #colormap=C,
                #                                      colormap_type=cmap_type,
                #                                      height=1000, width=900)
                graph = dcc.Graph(figure=px_mat)
                px_mat.update_traces(diagonal_visible=False)
            else:
                graph = html.P("No numericals found")
        elif radio == "nominal":
            if len(top_nominals):
                df_nom = df[top_nominals]
                df_nom["target"] = df["target"]

                parcats = [
                    go.Parcats(
                        dimensions=[
                            {"label": column, "values": list(df_nom[column].values)}
                            for column in df_nom.columns
                        ],
                        line={
                            "color": pd.Categorical(df_nom["target"]).codes,
                            "colorscale": "Portland",
                        },
                        hoveron="color",
                        hoverinfo="count+probability",
                        arrangement="freeform",
                    )
                ]
                layout = go.Layout(autosize=False, height=800)

                fig = go.Figure(data=parcats, layout=layout)
                graph = dcc.Graph(figure=fig)
            else:
                graph = html.P("No nominals found")

        return html.Div(graph, className="twelve columns")

    @app.callback(
        Output("scatter_plot", "children"),
        [
            Input("dropdown1", "value"),
            Input("dropdown2", "value"),
            Input("dropdown3", "value"),
            Input("url", "pathname"),
        ],
    )
    @cache.memoize(timeout=TIMEOUT)
    def update_scatter_plot(at1, at2, colorCode, url):
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
        data_id = int(re.search(r"data/(\d+)", url).group(1))
        logger.debug("loading data for scatter plot")
        try:
            df = pd.read_pickle("cache/df" + str(data_id) + ".pkl")
        except OSError:
            return []
        fig = {
            "data": [
                go.Scatter(
                    x=df[df[colorCode] == col][at1],
                    y=df[df[colorCode] == col][at2],
                    mode="markers",
                    marker={"size": 15, "line": {"width": 0.5, "color": "white"}},
                    name=str(col),
                )
                for col in set(df[colorCode])
            ],
            "layout": go.Layout(
                xaxis={"title": at1, "autorange": True},
                yaxis={"title": at2, "autorange": True},
                hovermode="closest",
                height=500,
            ),
        }
        logger.debug("scatter plot created")
        return html.Div(dcc.Graph(figure=fig), className="twelve columns")

    @app.callback(Output("stack", "options"), [Input("radio1", "value")])
    def update_radios(radio1):
        if radio1 == "target":
            options = [
                {"label": "Stack", "value": "stack"},
                {"label": "Un-stack", "value": "group"},
            ]
            return options
        else:
            return []


def generate_metric_row(col1, col2):
    return html.Div(
        className="row metric-row",
        children=[
            html.Div(className="three columns", children=col1),
            html.Div(
                style={"height": "50%"},
                className="nine columns",
                children=col2,
            ),
        ],
    )


def dist_plot(meta_data, attribute, type, radio_value, data_id, show_legend, df):

    # Extract target name and type
    try:
        target = meta_data[meta_data["Target"] == "true"]["Attribute"].values[0]
        target_type = meta_data[meta_data["Target"] == "true"]["DataType"].values[0]
    except IndexError:
        radio_value = "solo"

    # If we need color code by target
    if radio_value == "target":
        # Bin numeric target
        df.sort_values(by=target, inplace=True)
        if target_type == "numeric":
            df = bin_numeric(df, target, "target")
        else:
            df["target"] = df[target]
            df["target"] = df["target"].astype(str)

    # Attribute types
    if type == "numeric":
        if radio_value == "target":
            target_vals = list(df["target"].unique())
            N = len(df["target"].unique())
            color = ["hsl(" + str(h) + ",80%" + ",50%)" for h in np.linspace(0, 330, N)]
            data = [
                go.Histogram(
                    x=df[attribute][df["target"] == target_vals[i]],
                    name=str(target_vals[i]),
                    nbinsx=20,
                    histfunc="count",
                    showlegend=show_legend,
                    marker=dict(
                        color=color[i],
                        line=dict(
                            color=color[i],
                            width=1.5,
                        ),
                        cmin=0,
                        showscale=False,
                        colorbar=dict(
                            thickness=20, tickvals=color, ticktext=target_vals
                        ),
                    ),
                )
                for i in range(int(N))
            ]

        else:
            data = [
                {
                    "type": "violin",
                    "showlegend": False,
                    "x": df[attribute],
                    "box": {"visible": True},
                    "line": {"color": "black"},
                    "meanline": {"visible": True},
                    "fillcolor": "steelblue",
                    "name": "",
                    "opacity": 0.6,
                    # "x0": attribute
                }
            ]
    # If given attribute is nominal
    else:
        if radio_value == "target":
            target_vals = list(df["target"].unique())
            N = len(df["target"].unique())
            color = ["hsl(" + str(h) + ",80%" + ",50%)" for h in np.linspace(0, 330, N)]
            data = [
                go.Histogram(
                    x=(df[attribute][df["target"] == target_vals[i]]),
                    name=str(target_vals[i]),
                    showlegend=show_legend,
                    marker=dict(
                        color=color[i],
                        cmin=0,
                        showscale=False,
                        colorbar=dict(
                            thickness=20, tickvals=color, ticktext=target_vals
                        ),
                    ),
                )
                for i in range(int(N))
            ]

        else:
            data = [go.Histogram(x=(df[attribute]), name=attribute, showlegend=False)]
    return data
