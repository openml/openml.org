from sklearn.preprocessing import Imputer
import pandas as pd
from openml import datasets, tasks, runs, flows, config, evaluations, study

def clean_dataset(df):
    imp = Imputer(missing_values='NaN', strategy='most_frequent', axis=0)
    out = pd.DataFrame(imp.fit_transform(df), columns=df.columns)
    return out


def get_data_metadata(data_id):
    data = datasets.get_dataset(data_id)
    features = pd.DataFrame([vars(data.features[i]) for i in range(0, len(data.features))])
    is_target=[]
    for name in features["name"]:
        if name == data.default_target_attribute:
            is_target.append("true")
        else:
            is_target.append("false")
    features["Target"] = is_target

    size = []
    for value in features['nominal_values']:
        if value is not None:
            size.append(str(len(value)))
        else:
            size.append(' ')
    features['nominal_values'].replace({None: ' '}, inplace=True)
    features['# categories'] = size

    metafeatures = features[["name", "data_type",
                                 "number_missing_values", '# categories', "Target"]]

    metafeatures.rename(columns={"name": "Attribute", "data_type":"DataType",
                                 "number_missing_values": "Missing values",
                                     }, inplace=True)
    metafeatures.sort_values(by='Target', ascending=False, inplace=True)
    nominals = []
    numericals = []
    for index, row in features.iterrows():
        if row["data_type"] == "nominal":
            nominals.append(row["name"])
        else:
            numericals.append(row["name"])
    X, y, categorical, attribute_names = data.get_data()
    df = pd.DataFrame(X, columns=attribute_names)
    for column in df:
        df[column].fillna(df[column].mode(), inplace=True)
    return df, metafeatures, numericals, nominals


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
    leaderboard['highest_rank'] = list(highest_rank.values())
    leaderboard['Top Score'] = list(highest_score.values())
    return leaderboard