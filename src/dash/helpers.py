from sklearn.preprocessing import Imputer
import pandas as pd
from openml import datasets
import scipy.stats


def clean_dataset(df):
    imp = Imputer(missing_values='NaN', strategy='most_frequent', axis=0)
    out = pd.DataFrame(imp.fit_transform(df), columns=df.columns)
    return out


def get_data_metadata(data_id):
    """ Download the dataset and get metadata

    :param data_id: ID of the OpenML dataset
    :return:
    """
    # Get data in pandas df format
    data = datasets.get_dataset(data_id)
    x, y, categorical, attribute_names = data.get_data()
    df = pd.DataFrame(x, columns=attribute_names)
    df.to_pickle('cache/df'+str(data_id)+'.pkl')

    # Get meta-features and add target
    features = pd.DataFrame([vars(data.features[i]) for i in range(0, len(data.features))])
    is_target = ["true" if name == data.default_target_attribute else "false" for name in features["name"]]
    features["Target"] = is_target
    # Extract #categories
    size = [str(len(value)) if value is not None else ' ' for value in features['nominal_values']]
    features['nominal_values'].replace({None: ' '}, inplace=True)
    features['# categories'] = size
    # choose features to be displayed
    meta_features = features[["name", "data_type", "number_missing_values", '# categories', "Target"]]
    meta_features.rename(columns={"name": "Attribute", "data_type": "DataType",
                                  "number_missing_values": "Missing values"}, inplace=True)
    meta_features.sort_values(by='Target', ascending=False, inplace=True)
    # Add entropy
    numerical_features = list(meta_features["Attribute"][meta_features["DataType"] == "numeric"])
    nominal_features = list(meta_features["Attribute"][meta_features["DataType"] == "nominal"])
    entropy = []
    for column in meta_features['Attribute']:
        if column in nominal_features:
            count = df[column].value_counts()
            ent = scipy.stats.entropy(count)
            entropy.append(ent)
        else:
            entropy.append(0)
    meta_features['entropy'] = entropy

    return df, meta_features, numerical_features, nominal_features


def get_highest_rank(df, leaderboard):
    df.sort_values(by=['upload_time'], inplace=True)
    scores = []
    highest_rank = {}
    highest_score = {}

    setup_ids = []
    for index, row in df.iterrows():
        if row['setup_id'] not in setup_ids:
            users = list(highest_rank.keys())
            new_user = (row['uploader'] not in (users))
            setup_ids.append(row['setup_id'])
            score = row['value']
            if new_user or (score not in scores):
                scores.append(score)
                scores.sort(reverse=True)
                rank = scores.index(score) + 1
                if new_user or (highest_rank[row['uploader']] > rank):
                    highest_rank[row['uploader']] = rank
                    highest_score[row['uploader']] = score
                    if highest_rank[row['uploader']] > row['Rank']:
                        highest_rank[row['uploader']] = row['Rank']
    #leaderboard['highest_rank'] = list(highest_rank.values())
    leaderboard['Top Score'] = list(highest_score.values())
    return leaderboard