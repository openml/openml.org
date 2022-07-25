import os
import logging
import time
from contextlib import contextmanager

import numpy as np
import pandas as pd
import scipy.stats
import openml
from openml import datasets, runs
from sklearn.model_selection import train_test_split

logger = logging.getLogger("dashboard")
logger.setLevel(logging.DEBUG)

openml.config.server = os.getenv('BACKEND_SERVER')

def get_run_df(run_id: int):
    run = runs.get_run(int(run_id), ignore_cache=True)
    df = pd.DataFrame(run.fold_evaluations.items(), columns=["evaluations", "results"])
    # Evaluations table
    result_list = []
    result_string = []
    for result in df["results"]:
        k_folds = list(result[0].values())
        mean = str(np.round(np.mean(np.array(k_folds)), 3))
        std = str(np.round(np.std(np.array(k_folds)), 3))
        result_list.append(k_folds)
        result_string.append(mean + " \u00B1 " + std)
    df.drop(["results"], axis=1, inplace=True)
    df["results"] = result_list
    df["values"] = result_string
    # Add some more rows indicating output prediction file name
    df2 = pd.DataFrame(run.output_files.items(), columns=["evaluations", "results"])
    df2["values"] = ""
    df3 = pd.DataFrame(
        {"task_type": run.task_type}.items(), columns=["evaluations", "results"]
    )
    df2["values"] = ""
    df = df.append(df2)
    df = df.append(df3)
    df.to_pickle("cache/run" + str(run_id) + ".pkl")
    return run, df


def clean_dataset(df):

    df = df.loc[:, df.isnull().mean() < 0.8]
    out = df.fillna(df.mode().iloc[0])
    return out


def get_metadata(data_id: int):
    data = datasets.get_dataset(data_id, download_data=False)
    features = pd.DataFrame(
        [vars(data.features[i]) for i in range(0, len(data.features))]
    )
    is_target = [
        "true" if name == data.default_target_attribute else "false"
        for name in features["name"]
    ]
    features["Target"] = is_target

    # Extract #categories
    size = [
        str(len(value)) if value is not None else " "
        for value in features["nominal_values"]
    ]
    features["nominal_values"].replace({None: " "}, inplace=True)
    features["# categories"] = size

    # choose features to be displayed
    meta_features = features[
        ["name", "data_type", "number_missing_values", "# categories", "Target"]
    ]
    meta_features.rename(
        columns={
            "name": "Attribute",
            "data_type": "DataType",
            "number_missing_values": "Missing values",
        },
        inplace=True,
    )
    meta_features.sort_values(by="Target", ascending=False, inplace=True)
    if meta_features.shape[0] > 1000:
        meta_features = meta_features[:1000]
    return meta_features, data, (vars(data)["name"])


def get_data_metadata(data_id):
    """Download the dataset and get metadata

    :param data_id: ID of the OpenML dataset
    :return:
    """
    # Get data in pandas df format
    import time

    start = time.time()
    meta_features, data, _ = get_metadata(data_id)

    # Replacing the substring to when Docker is active
    if (os.getenv('DASHBOARD_USE_DOCKER_CONTAINER_NAME', 'False') == "True"):
        data.url = data.url.replace("localhost", os.getenv('DASHBOARD_PHP_CONTAINER_NAME', 'website'))
        print(data)

    x, y, categorical, attribute_names = data.get_data()

    df = pd.DataFrame(x, columns=attribute_names)
    if x.shape[0] < 50000:
        df.to_pickle("cache/df" + str(data_id) + ".pkl")
    else:
        # create a subsample of data for large datasets
        try:
            target_feat = meta_features[meta_features["Target"] == "true"][
                "Attribute"
            ].values[0]
        except IndexError:
            target_feat = None
            pass

        if x.shape[0] >= 50000 and target_feat:
            df = clean_dataset(df)
            if x.shape[0] < 100000:
                sample_size = 0.5
            elif 100000 <= x.shape[0] < 500000:
                sample_size = 0.25
            elif 500000 <= x.shape[0] < 1e6:
                sample_size = 0.1
            else:
                sample_size = 0.05
            x = df.drop(target_feat, axis=1)
            y = df[target_feat]
            try:
                X_train, X_test, y_train, y_test = train_test_split(
                    x, y, stratify=y, test_size=sample_size
                )
            except ValueError:
                X_train, X_test, y_train, y_test = train_test_split(
                    x, y, stratify=None, test_size=sample_size
                )

            x = X_test
            x[target_feat] = y_test
            df = pd.DataFrame(x, columns=attribute_names)
            df.to_pickle("cache/df" + str(data_id) + ".pkl")
        else:
            df.to_pickle("cache/df" + str(data_id) + ".pkl")

    meta_features = meta_features[
        meta_features["Attribute"].isin(pd.Series(df.columns))
    ]

    # Add entropy
    numerical_features = list(
        meta_features["Attribute"][meta_features["DataType"] == "numeric"]
    )
    nominal_features = list(
        meta_features["Attribute"][meta_features["DataType"] == "nominal"]
    )
    entropy = []

    for column in meta_features["Attribute"]:
        if column in nominal_features:
            count = df[column].value_counts()
            ent = round(scipy.stats.entropy(count), 2)
            entropy.append(ent)
        else:
            entropy.append(" ")
    meta_features["Entropy"] = entropy
    meta_features["Target"].replace({"false": " "}, inplace=True)
    end = time.time()
    logger.debug("time taken download data and find entropy " + str(end - start))
    return df, meta_features, numerical_features, nominal_features


def get_highest_rank(df, leaderboard):
    df.sort_values(by=["upload_time"], inplace=True)
    scores = []
    # highest_rank = {}
    highest_score = {}

    setup_ids = []

    for index, row in df.iterrows():
        users = list(highest_score.keys())
        new_user = row["uploader_name"] not in users
        if row["setup_id"] not in setup_ids or new_user:
            setup_ids.append(row["setup_id"])
            score = row["value"]
            if new_user or (score not in scores):
                scores.append(score)
                scores.sort(reverse=True)
                # rank = scores.index(score) + 1
                if new_user or (highest_score[row["uploader_name"]] < score):
                    # highest_rank[row['uploader_name']] = rank
                    highest_score[row["uploader_name"]] = score
                # if highest_rank[row['uploader_name']] > row['Rank']:
                #   highest_rank[row['uploader_name']] = row['Rank']
    # leaderboard['highest_rank'] = list(highest_rank.values())

    leaderboard["Top Score"] = list(highest_score.values())
    return leaderboard


def splitDataFrameList(df, target_column):
    """df = dataframe to split,
    target_column = the column containing the values to split
    separator = the symbol used to perform the split
    returns: a dataframe with each entry for the target column separated,
     with each element moved into a new row.
    The values in the other columns are duplicated across the newly divided rows.
    """

    def splitListToRows(row, row_accumulator, target_column):
        split_row = row[target_column]
        for s in split_row:
            new_row = row.to_dict()
            new_row[target_column] = s
            row_accumulator.append(new_row)

    new_rows = []
    df.apply(splitListToRows, axis=1, args=(new_rows, target_column))
    new_df = pd.DataFrame(new_rows)
    return new_df


@contextmanager
def print_duration(name: str):
    start = time.time()
    yield
    print(f"{name}: {time.time() - start:.3f}s")


def bin_numeric(df, column_name, output_name):
    df[output_name] = pd.cut(df[column_name], 1000).astype(str)
    cat = df[output_name].str.extract(r"\((.*),", expand=False).astype(float)
    df["bin"] = pd.Series(cat)
    df.sort_values(by="bin", inplace=True)
    df[output_name] = df[output_name].str.replace(",", " -")
    df[output_name] = df[output_name].str.replace("(", "")
    df[output_name] = df[output_name].str.replace("]", "")
    return df
