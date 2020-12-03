import os
import openml
from openml import datasets
from openml.datasets.functions import DATASETS_CACHE_DIR_NAME
# get all datasets before running app, so that datasets are loaded faster
from openml.utils import _create_cache_directory_for_id
root_dir = os.path.abspath(os.sep)
openml.config.cache_directory = os.path.join(root_dir, "public", "python-cache", ".openml", "cache")
df = datasets.list_datasets(output_format='dataframe')

for idx, row in df.iterrows():
    data_id = row['did']
    instances = row['NumberOfInstances']
    cols = row['NumberOfFeatures']
    print(data_id)
    # delete existing cache directory
    did_cache_dir = _create_cache_directory_for_id(DATASETS_CACHE_DIR_NAME, data_id, )
    # print(did_cache_dir)
    if os.path.exists(did_cache_dir):
        openml.utils._remove_cache_dir_for_id(DATASETS_CACHE_DIR_NAME, did_cache_dir)

    # download dataset and cache again
    try:
        # feather is faster when rows are higher and cols are lower
        if instances > 100000 and cols < 10000:
            datasets.get_dataset(data_id, cache_format='feather')
        else:
            datasets.get_dataset(data_id)
    except (FileNotFoundError, openml.exceptions.OpenMLServerException):
        pass
