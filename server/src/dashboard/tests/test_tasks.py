import time
from openml import evaluations
import numpy as np
from .test_config import *


def test_task_page_loading(dash_br):
    dash_br.server_url = f"{BASE_URL}task/2"
    time.sleep(5)
    assert dash_br.get_logs() == [], "browser console should contain no error"


def test_task_graph_elements(dash_br):
    task_id = 2
    dash_br.server_url = f"{BASE_URL}task/{task_id}"
    time.sleep(10)
    task_plot = dash_br.find_element("#tab1")
    evals = evaluations.list_evaluations(function='area_under_roc_curve', size=10, sort_order='desc',
                                         task=[task_id], output_format='dataframe')
    assert (task_plot.text is not None, "Task plot is not loading")


# def test_all_tasks(dash_br):
#     df = tasks.list_tasks(output_format='dataframe')
#     ids = []
#     for id in df['task_id'].values:
#         dash_br.server_url = BASE_URL + 'task/'+ str(id)
#         time.sleep(5)
#         if dash_br.get_logs() != []:
#             ids.append(id)
#     np.save('task_ids.npy', np.asarray(ids))
