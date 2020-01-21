# Dash visualization
Dash is a python framework which is suitable for building data visualization dashboards using pure python. Dash is written on top of plotly, react and flask and the graphs are defined using plotly python. The dash application is composed of two major parts :

  - `Layout`  - Describes how the dashboard looks like
  - `Callbacks`  - Used to update graphs, tables in the layout and makes the dashboard interactive. 
 

# Files
The dash application is organized as follows:
- `dashapp.py`
	- Creates the dash application
	- The dash app is embedded in the flask app passed to `create_dash_app` function
	- This file need not be modified to create a new plot
- `layouts.py`
	- contains the layout for all the pages
	- `get_layout_from_data`- returns layout of data visualization 
	-  `get_layout_from_task`- returns layout of task visualization 
	- `get_layout_from_flow`- returns layout of flow visualization 
	- `get_layout_from_run` -  returns layout of run visualization 
	-  This file needs to be modified to add a new plot (data, task, flow, run)
- `callbacks.py`
	- Registers all the callbacks for the dash application
	- This file needs to be modified to add a new plot, especially if the plot needs to be interactive

## How the dashboard works
In this dash application, we need to create the layout of the page dynamically based on the entered URL. 
For example,  [http://127.0.0.1:5000/dashboard/data/5] needs to return the layout for dataset id #5 whereas 
[http://127.0.0.1:5000/dashboard/run/5] needs to return the layout for run id #5.

Hence , the dash app is  initially created with a dummy `app.layout` by dashapp.py and 
the callbacks are registered for the app using `register_callbacks` function.  

 - **render_layout** is the callback which dynamically renders layout. Once the dash app is running, the first callback which  is fired is `render_layout.` 
   This is the main callback invoked when  a URL with a data , task, run or flow ID is entered. 
   Based on the path and ID in the URL, this method returns the layout. 
 
 - Based on the URL, get_layout_from_data, get_layout_from_task, get_layout_from_flow, get_layout_from_run are called.
   These functions define the layout of the page - tables, tabs, graphs etc.
 
 - The callbacks corresponding to each component in the layout are invoked to update the components dynamically and
   make the graphs interactive. For example, **update_scatter_plot** in `data_callbacks.py` updates the scatter plot
   component in the data visualization dashboard.  

## Example: adding a graph
This example walks through the process of adding a new data visualization.
The steps are similar for run, task and flow visualizations.
### Non-interactive graph
If the graph is non-interactive, layouts.py is the only file that needs to be modified.
The data can be directly specified for a graph component and added to the layout.

This is similar to adding a plotly graph:

```# make a plotly figure
fig = go.Figure(data=go.Scatter(
    x=[1, 2, 3, 4],
    y=[10, 11, 12, 13],
    mode='markers',
    marker=dict(size=[40, 60, 80, 100],
                color=[0, 1, 2, 3])
))    
# add it to dash graph component
dcc.Graph(id='scatterPlotGraph',
          figure = fig)
  ```
          
Since we would like to add this to the data dashboard, dcc.Graph component needs to added to the 'layout' in get_layout_from_data method.

 
## Interactive graph
 In order to add an interactive graph, we need to specify the graph component in the layout and
 update it in the callbacks.
 
The best example for this is the scatter_plot component found in get_layout_from_data function in layouts.py
and updated in data_callbacks.py

The first step is to add the layout. In this case, we have 3 drop-down components
and a html.Div component called scatter_plot.
```             html.Div([
                    html.Div(dcc.Dropdown(
                        id='dropdown1',
                        options=[
                            {'label': i, 'value': i} for i in numerical_data
                        ],
                        multi=False,
                        clearable=False,
                        value=numerical_data[0]
                    )),
                    html.Div(dcc.Dropdown(
                        id='dropdown2',
                        options=[
                            {'label': i, 'value': i} for i in numerical_data
                        ],
                        multi=False,
                        clearable=False,
                        value=numerical_data[0]

                    )),
                    html.Div(dcc.Dropdown(
                        id='dropdown3',
                        options=[
                            {'label': i, 'value': i} for i in nominal_data],
                        multi=False,
                        clearable=False,
                        value=nominal_data[0])),
                    html.Div(id='scatter_plot'), ])```
                    
                    
 # In the callbacks, we wil update the scatter_plot component with a graph dynamically,
 based on the dropdown selection.
 
```     @app.callback(Output('scatter_plot', 'children'), [
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
 ```
