import time

import pandas as pd
from openml import runs
import numpy as np
from .test_config import BASE_URL


def uncommon_string(s1, s2):
    st1 = set(s1)
    st2 = set(s2)
    lst = list(st1 & st2)
    finallist = [i for i in s1 if i not in lst] + [i for i in s2 if i not in lst]
    return finallist


def test_run_page_loading(dash_br):
    dash_br.server_url = f"{BASE_URL}run/10228060"
    time.sleep(5)
    assert dash_br.get_logs() == [], "browser console should contain no error"


def test_run_data(dash_br):
    # Test if feature table is loaded correctly.
    run_id = 10228060
    items = vars(runs.get_run(int(run_id)))
    ordered_dict = (items['fold_evaluations'])
    df = pd.DataFrame(ordered_dict.items(), columns=['evaluations', 'results'])
    result_list = []
    error = []
    for dic in df['results']:
        x = (dic[0])
        values = [x[elem] for elem in x]
        mean = str(np.round(np.mean(np.array(values), axis=0), 3))
        std = str(np.round(np.std(np.array(values), axis=0), 3))
        result_list.append(values)
        error.append(mean + " \u00B1 " + std)
    df.drop(['results'], axis=1, inplace=True)
    df['results'] = result_list
    df['values'] = error
    d = df.drop(['results'], axis=1)
    dash_br.server_url = f"{BASE_URL}run/{run_id}"
    time.sleep(5)
    feature_table = dash_br.find_element("#runtable")
    actual_table = (feature_table.text.split("values")[-1])
    expected_table = ""
    for index, row in d.iterrows():
        for element in row:
            if element != ' ':
                expected_table = expected_table + str(element) + "\n"
    assert(uncommon_string(actual_table, expected_table) == [])


def test_run_graph_elements(dash_br):
    run_id = 10228060
    dash_br.server_url = f"{BASE_URL}run/{run_id}"
    time.sleep(10)
    distribution_plot = dash_br.find_element("#runplot")  # find_element_by_css_selector("#graph1")
    pr = dash_br.find_element("#pr")
    assert("area_under_roc_curve" in distribution_plot.text)
    assert("Recall" in pr.text)

#
# def test_all_runs(dash_br):
#     df = runs.list_runs(output_format='dataframe')
#     ids = []
#     for id in df['run_id'].values:
#         dash_br.server_url = f"{BASE_URL}run/{id}"
#         time.sleep(5)
#         if dash_br.get_logs() != []:
#             ids.append(id)
#     np.save('run_ids.npy', np.asarray(ids))
