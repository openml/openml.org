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
	-  `get_layout_from_task`- returns layout of taskvisualization 
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
   Based on the information in the URL, this method returns the layout. 
 
 - Based on the URL, get_layout_from_data, get_layout_from_task, get_layout_from_flow, get_layout_from_run are called.
   These functions define the layout of the page - tables, html Divs, tabs, graphs etc.
 
 - The callbacks corresponding to each component in the layout are invoked to update the components dynamically and
   make the graphs interactive. For example, **update_scatter_plot** in `data_callbacks.py` updates the scatter plot
   component in the data visualization dashboard.  
   