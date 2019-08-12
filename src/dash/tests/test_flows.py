import time
from src.dash.helpers import get_data_metadata
import os
import shutil
from collections import Counter
from openml import runs, flows, evaluations
import pandas as pd
import numpy as np


def test_flow_page_loading(dash_br):
    dash_br.server_url = 'http://127.0.0.1:5000/dashboard/flow/405'
    time.sleep(5)
    assert dash_br.get_logs() == [], "browser console should contain no error"


def test_flow_graph_elements(dash_br):
    flow_id = 405
    dash_br.server_url = 'http://127.0.0.1:5000/dashboard/flow/'+str(flow_id)
    time.sleep(10)
    flow_plot = dash_br.find_element("#flowplot") #find_element_by_css_selector("#graph1")
    assert("cars" in flow_plot.text)

