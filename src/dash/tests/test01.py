import time
from src.dash.helpers import get_data_metadata

def test_data(dash_br):
    data_id = 5
    df, metadata, numerical_data, nominal_data, name = get_data_metadata(data_id)
    dash_br.server_url = 'http://127.0.0.1:5000/dashboard/data/5'
    #assert dash_br.wait_for_element("h1").text == "Welcome to dash dashboard"
    time.sleep(20)
    distribution_plot = dash_br.find_element("#distribution")
    feature_table = dash_br.find_element("#datatable")
    feature_importance = dash_br.find_element("#fi")
    assert dash_br.get_logs() == [], "browser console should contain no error"
    print(feature_table.text)
