import time
from openml import runs, flows, evaluations
BASE_URL = 'http://127.0.0.1:5000/dashboard/'
from openml import datasets, tasks, runs, flows, config, evaluations, study
import numpy as np


def test_flow_page_loading(dash_br):
    dash_br.server_url = BASE_URL + 'task/2'
    time.sleep(5)
    assert dash_br.get_logs() == [], "browser console should contain no error"


def test_flow_graph_elements(dash_br):
    task_id = 2
    dash_br.server_url = BASE_URL + 'task/'+str(task_id)
    time.sleep(10)
    task_plot = dash_br.find_element("#tab1")
    print(task_plot.text)


def test_all_tasks(dash_br):
    df = tasks.list_tasks(output_format='dataframe')
    ids = []
    for id in df['task_id'].values:
        dash_br.server_url = BASE_URL + 'task/'+ str(id)
        time.sleep(5)
        if dash_br.get_logs() != []:
            ids.append(id)
    np.save('task_ids.npy', np.asarray(ids))
