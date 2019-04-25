The dashapp is composed of two parts :
* Layouts found in `layouts.py`
* Callbacks found in `callbacks.py`

In order to add a new graph for datasets, add the graph to the `get_graph_from_data` function.

For example, 
`dcc.Graph(id='scatterPlotGraph',
           style={'height': '100%', 'width': '100%', 'position': 'absolute'})`
If the graph is non-interactive or static, the data can just be added to the graph component.           
If graph needs to be updated dynamically using interactions such as dropdown, checklists etc, a callback needs to be 
added. This callback needs to return a figure. Refer to `update_dualVariableGraph` callback in `callbacks.py`.


OpenML_Plots.py file contains a single function that generates and returns a Flask Application containing the three visualizations for the given dataset.
The dataset can be distinguished by finding the file ID and the dataset ID and filling them in in the funtion.

EXAMPLE:
-----------------
To get the application corresponding to file and dataset ID 14:

import OpenML_Plots as plots

app = plots.generate_app(14,14)


To run the application corresponding to file and dataset ID 14:

import OpenML_Plots as plots

plots.generate_app(14,14).run_server(debug = False)


Now for general code documentation:

Lines 31-58 handle the general data preprocessing: distinguishing and categorizing variables
Line 63 creates the layout object of the application, the construction of this object is closed on line 161. The reason why this is so long is because Dash requires the composition of the entire layout on construction, and functionality is added later. The general structure is as follows:

ATTRIBUTE SELECTOR####COLOR CODE SELECTOR

#####################

SINGLE VARIABLE PLOT

#####################

ATTRIBUTE SELECTOR####ATTRIBUTE SELECTOR####COLOR CODE SELECTOR

#####################

DUAL VARIABLE PLOT

#####################

ATTRIBUTE SELECTOR

#####################

PARALLEL LINES PLOT

After line 161 the functionality is added. Each callback makes sure that the functionality for a plot is added.