import time
from openml import runs, flows, evaluations
BASE_URL = 'http://127.0.0.1:5000/dashboard/'


def test_flow_page_loading(dash_br):
    dash_br.server_url = BASE_URL + 'task/14681'
    time.sleep(5)
    assert dash_br.get_logs() == [], "browser console should contain no error"


def test_flow_graph_elements(dash_br):
    task_id = 14681
    dash_br.server_url = BASE_URL + 'task/'+str(task_id)
    time.sleep(10)
    task_plot = dash_br.find_element("#tab1")
    print(task_plot.text)

