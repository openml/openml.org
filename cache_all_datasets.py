from openml import datasets

# get all datasets before running app, so that datasets are loaded faster
df = datasets.list_datasets(output_format='dataframe')

for data_id in df['did']:
    try:
        datasets.get_dataset(data_id)
    except FileNotFoundError:
        pass
