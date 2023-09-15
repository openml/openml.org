import time
import os

import openml
from openml import evaluations

from server.src.dashboard.dash_config import BASE_URL

openml.config.server = os.getenv('BACKEND_SERVER')

# def test_flow_page_loading(dash_br):
#     dash_br.server_url = BASE_URL + 'flow/405'
#     time.sleep(10)
#     assert dash_br.get_logs() == [], "browser console should contain no error"


def test_flow_graph_elements(dash_br):
    flow_id = 405
    dash_br.server_url = BASE_URL + "flow/" + str(flow_id)
    time.sleep(15)
    flow_plot = dash_br.find_element("#flowplot")
    evals = evaluations.list_evaluations(
        function="area_under_roc_curve",
        flows=[flow_id],
        sort_order="desc",
        size=10,
        output_format="dataframe",
    )
    # Check if the data of first 10 evaluations match
    list_of_data = list(evals["data_name"].values)
    for element in list_of_data:
        assert element in flow_plot.text


def test_flow_dropdowns(dash_br):
    flow_id = 405
    dash_br.server_url = BASE_URL + "flow/" + str(flow_id)
    time.sleep(10)
    metric_dropdown = dash_br.find_element("#metric")
    tasktype_dropdown = dash_br.find_element("#tasktype")
    parameter_dropdown = dash_br.find_element("#parameter")
    metric_dropdown.click()
    parameter_dropdown.click()
    parameter_dropdown.click()
    assert "area_under_roc_curve" in metric_dropdown.text
    assert "Supervised classification" in tasktype_dropdown.text
    assert "I" in parameter_dropdown.text


# def test_all_flows(dash_br):
#     df = flows.list_flows(output_format='dataframe')
#     ids = []
#     for id in df['flow_id'].values:
#         dash_br.server_url = BASE_URL + 'flow/'+ str(id)
#         time.sleep(5)
#         if dash_br.get_logs() != []:
#             ids.append(id)
#     np.save('flow_ids.npy', np.asarray(ids))
#


def test_flow_overviews(dash_br):
    dash_br.server_url = f"{BASE_URL}flow/"
    time.sleep(10)
    assert dash_br.get_logs() == []
    flow_chart = dash_br.find_element("#flow_ovplot")
    assert flow_chart.text is not None
    assert "sklearn" in flow_chart.text
