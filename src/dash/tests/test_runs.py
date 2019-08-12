import time
from src.dash.helpers import get_data_metadata
import os
import shutil
from collections import Counter
from openml import runs, flows, evaluations
import pandas as pd
import numpy as np
def uncommon_string(s1, s2):
    st1 = set(s1)
    st2 = set(s2)
    lst = list(st1 & st2)
    finallist = [i for i in s1 if i not in lst] + [i for i in s2 if i not in lst]
    return finallist


def test_run_page_loading(dash_br):
    dash_br.server_url = 'http://127.0.0.1:5000/dashboard/run/10228060'
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
        mean = str(round(np.mean(np.array(values), axis=0), 3))
        std = str(round(np.std(np.array(values), axis=0), 3))
        result_list.append(values)
        error.append(mean + " \u00B1 " + std)
    df.drop(['results'], axis=1, inplace=True)
    df['results'] = result_list
    df['values'] = error
    d = df.drop(['results'], axis=1)
    dash_br.server_url = 'http://127.0.0.1:5000/dashboard/run/10228060'
    time.sleep(5)
    feature_table = dash_br.find_element("#runtable")
    actual_table = (feature_table.text.split("values")[-1])
    expected_table = ""
    for index, row in d.iterrows():
        for element in row:
            if element != ' ':
                expected_table = expected_table + str(element) + "\n"
    assert(sum((Counter(actual_table) & Counter(expected_table)).values()) == len(actual_table))
    assert(uncommon_string(actual_table, expected_table) == [])


def test_run_graph_elements(dash_br):
    run_id = 10228060
    dash_br.server_url = 'http://127.0.0.1:5000/dashboard/run/'+str(run_id)
    time.sleep(10)
    distribution_plot = dash_br.find_element("#runplot") #find_element_by_css_selector("#graph1")
    pr = dash_br.find_element("#pr")
    assert("area_under_roc_curve" in distribution_plot.text)
    assert("Recall" in pr.text)


