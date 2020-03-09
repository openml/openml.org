import time

from .test_config import BASE_URL
from ..helpers import get_metadata


def uncommon_string(s1, s2):
    lst = list(set(s1) & set(s2))
    finallist = [i for i in s1 if i not in lst] + [i for i in s2 if i not in lst]
    return finallist


def test_data_page_loading(dash_br):
    data_id = 5
    dash_br.server_url = f"{BASE_URL}data/{data_id}"
    time.sleep(5)
    assert dash_br.get_logs() == [], "browser console should contain no error"


def test_metadata_table(dash_br):
    # Test if feature table is loaded correctly.
    data_id = 5
    metadata, data, _ = get_metadata(data_id)

    dash_br.server_url = f"{BASE_URL}data/{data_id}"
    time.sleep(5)
    feature_table = dash_br.find_element("#datatable")
    actual_table = (feature_table.text.split("Entropy")[-1])
    assert len(actual_table.split("\n")) >= metadata.shape[0]


def test_distribution_loaded(dash_br):
    data_id = 50
    dash_br.server_url = f"{BASE_URL}data/{data_id}"
    time.sleep(20)
    distribution_plot = dash_br.find_element("#table-graph")
    fi = dash_br.find_element("#fi")
    assert "middle-middle-square" in fi.text
    assert "negative" in distribution_plot.text


def test_scatter_plots(dash_br):
    data_id = 5
    dash_br.server_url = f"{BASE_URL}data/{data_id}"
    time.sleep(20)
    scatter_matrix = dash_br.find_element("#matrix")
    scatter_plot = dash_br.find_element("#scatter_plot")
    assert scatter_matrix.text is not None
    assert scatter_plot.text is not None


# def catch_errors_in_datasets(dash_br):
#     df = datasets.list_datasets(output_format='dataframe')
#     ids = []
#     for id in df['did'].values[100:]:
#         dash_br.server_url = BASE_URL + 'data/'+ str(id)
#         time.sleep(5)
#         if dash_br.get_logs() != []:
#             ids.append(id)
#     pd.DataFrame(ids).to_csv('ids.csv')

def test_data_overviews(dash_br):
    dash_br.server_url = f"{BASE_URL}data/"
    print(dash_br.get_logs())
    pie_chart = dash_br.find_element('#data_overview')
    print(pie_chart.text)
