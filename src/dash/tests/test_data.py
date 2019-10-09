import time
from src.dash.helpers import get_data_metadata
import os
import shutil
from collections import Counter
from openml import datasets, tasks, runs, flows, config, evaluations, study
import os, pandas as pd, numpy as np
BASE_URL = 'http://127.0.0.1:5000/dashboard/'


def uncommon_string(s1, s2):
    st1 = set(s1)
    st2 = set(s2)
    lst = list(st1 & st2)
    finallist = [i for i in s1 if i not in lst] + [i for i in s2 if i not in lst]
    return finallist


def test_data_page_loading(dash_br):
    dash_br.server_url = BASE_URL + 'data/5'
    time.sleep(5)
    assert dash_br.get_logs() == [], "browser console should contain no error"


def test_table_data(dash_br):
    # Test if feature table is loaded correctly.
    data_id = 5
    shutil.rmtree('cache', ignore_errors=True)
    os.mkdir('cache')
    _, metadata, _, _, _ = get_data_metadata(data_id)
    dash_br.server_url = BASE_URL + 'data/5'
    time.sleep(5)
    feature_table = dash_br.find_element("#datatable")
    actual_table = (feature_table.text.split("Entropy")[-1])
    expected_table = ""
    for index, row in metadata.iterrows():
        for element in row:
            if element != ' ':
                expected_table = expected_table + str(element) + "\n"
    assert(sum((Counter(actual_table) & Counter(expected_table)).values()) == len(actual_table))
    assert(uncommon_string(actual_table, expected_table) == [])


def test_graph_elements_loaded(dash_br):
    data_id = 50
    dash_br.server_url = BASE_URL + 'data/50'
    time.sleep(10)
    distribution_plot = dash_br.find_element("#distribution") #find_element_by_css_selector("#graph1")
    fi = dash_br.find_element("#fi")
    assert("middle-middle-square" in fi.text)
    assert("negative" in distribution_plot.text)


def test_alternate_tabs(dash_br):
    data_id = 5
    dash_br.server_url = BASE_URL + '/data/5'
    time.sleep(20)
    scatter_matrix = dash_br.find_element("#tab2").find_element_by_css_selector("#matrix")
    assert(scatter_matrix.text is not None)


def test_all_datasets(dash_br):
    df = datasets.list_datasets(output_format='dataframe')
    ids = []
    for id in df['did'].values[:30]:
        dash_br.server_url = BASE_URL + 'data/'+ str(id)
        time.sleep(5)
        if dash_br.get_logs() != []:
            ids.append(id)
            print(id)
    np.save('ids.npy', np.asarray(ids))
