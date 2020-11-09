from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (get_jwt_identity, jwt_required)
from server.user.models import User
from werkzeug.utils import secure_filename
from pathlib import Path
import os
import openml
import pandas as pd
import json
import arff
from urllib.parse import parse_qs, urlparse
import pdb 

data_blueprint = Blueprint("data", __name__, static_folder='server/src/client/app/build')

CORS(data_blueprint)


@data_blueprint.route("/data-edit", methods=['GET', 'POST'])
@jwt_required
def data_edit():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    openml.config.apikey = user.session_hash
    testing = os.environ.get('TESTING')
    if testing:
        openml.config.start_using_configuration_for_example()
    url = request.args.get('url')
    parsed = urlparse(url)
    dataset_id = parse_qs(parsed.query)['id']
    dataset_id = int(dataset_id[0])
    print(dataset_id)
    if request.method == 'GET':

        dataset_info = openml.datasets.list_datasets([dataset_id])
        dataset_info = list(dataset_info.items())
        # Its a nested ordered dictionary the first index is to get id, second to get info and third for upload
        uploader_id = dataset_info[0][1]['uploader']
        owner = 'false'
        dataset = openml.datasets.get_dataset(dataset_id)
        if (int(user.id) == int(uploader_id)):
            owner = 'true'
        print(jsonify({"user_id": user.id,
                       "description": dataset.description, "creator": dataset.creator, "date": dataset.collection_date,
                       "citation": dataset.citation, "language": dataset.language,
                       "default_target_attribute": dataset.default_target_attribute,
                       "ignore_attribute": dataset.ignore_attribute,
                       "row_id_attribute": dataset.row_id_attribute, "owner": owner}))
        return jsonify({"user_id": user.id,
                        "description": dataset.description, "creator": dataset.creator, "date": dataset.collection_date,
                        "citation": dataset.citation, "language": dataset.language,
                        "default_target_attribute": dataset.default_target_attribute,
                        "ignore_attribute": dataset.ignore_attribute,
                        "row_id_attribute": dataset.row_id_attribute, "owner": owner}), 200
    elif request.method == "POST":
        j_obj = request.get_json()
        # dataset = openml.datasets.get_dataset(int(dataset_id))
        owner = j_obj['owner']
        description = j_obj['description']
        creator = j_obj['creator']
        collection_date = j_obj['date']
        citation = j_obj['citation']
        language = j_obj['language']
        if description == '':
            description = None
        if creator == '':
            creator = None
        if collection_date == '':
            collection_date = None
        if citation == '':
            citation = None
        if language == '':
            language = None
        if owner == 'false':
            data_id = openml.datasets.edit_dataset(dataset_id,
                                                   description=description,
                                                   creator=creator,
                                                   collection_date=collection_date,
                                                   citation=citation,
                                                   language=language)
        elif owner == 'true':
            default_target_attribute = j_obj['default_target_attribute']
            ignore_attribute = j_obj['ignore_attribute']
            row_id_attribute = j_obj['row_id_attribute']
            if default_target_attribute == '':
                default_target_attribute = None
            if ignore_attribute == '':
                ignore_attribute = None
            if row_id_attribute == '':
                row_id_attribute = None
            try:
                data_id = openml.datasets.edit_dataset(dataset_id,
                                                       description=description,
                                                       creator=creator,
                                                       collection_date=collection_date,
                                                       citation=citation,
                                                       language=language,
                                                       default_target_attribute=default_target_attribute,
                                                       ignore_attribute=ignore_attribute,
                                                       row_id_attribute=row_id_attribute)
            except:
                return 'error'
                # print(e)
                # if e.code == 1065:
                #     return e

        return str('data edit successful')


# @data_blueprint.route('/data-edit-critical', methods=['POST'])
# @jwt_required
# def data_edit_critical():
#     current_user = get_jwt_identity()
#     user = User.query.filter_by(email=current_user).first()
#     openml.config.apikey = user.session_hash
#     # TODO change line below in development\
#     testing = os.environ.get('TESTING')
#     if testing:
#         openml.config.start_using_configuration_for_example()
#     j_obj = request.get_json()
#     dataset_id = j_obj['dataset_id']
#     dataset_id = int(dataset_id)
#     default_target_attribute = j_obj['default_target_attribute']
#     ignore_attribute = j_obj['ignore_attribute']
#     row_id_attribute = j_obj['row_id_attribute']
#     if default_target_attribute == '':
#         default_target_attribute = None
#     if ignore_attribute == '':
#         ignore_attribute = None
#     if row_id_attribute == '':
#         row_id_attribute = None
#     data_id = openml.datasets.edit_dataset(dataset_id,
#                                            default_target_attribute=default_target_attribute,
#                                            ignore_attribute=ignore_attribute,
#                                            row_id_attribute=row_id_attribute
#                                            )
#     return str(data_id)


@data_blueprint.route('/data-upload', methods=['POST'])
@jwt_required
def data_upload():
    """
    Function to upload dataset
    """
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user_api_key = user.session_hash
    openml.config.apikey = user.session_hash
    # TODO change line below in development\
    testing = os.environ.get('TESTING')
    if testing:
        openml.config.start_using_configuration_for_example()
    # openml.config.start_using_configuration_for_example()

    print(request)
    data_file = request.files['dataset']
    print(data_file)
    metadata = request.files['metadata']
    print(metadata)
    Path("temp_data/").mkdir(parents=True, exist_ok=True)
    data_file.save('temp_data/' + user_api_key + '?' + secure_filename(data_file.filename))
    path = 'temp_data/' + user_api_key + '?' + secure_filename(data_file.filename)
    metadata = metadata.read()
    metadata = json.loads(metadata)
    dataset_name = metadata['dataset_name']
    description = metadata['description']
    creator = metadata['creator']
    contributor = metadata['contributor']
    collection_date = metadata['collection_date']
    licence = metadata['licence']
    language = metadata['language']
    # attribute = metadata['attribute']
    def_tar_att = metadata['def_tar_att']
    ignore_attribute = metadata['ignore_attribute']
    citation = metadata['citation']
    file_name, file_extension = os.path.splitext(data_file.filename)
    # TODO: Support custom attribute types
    supported_extensions = ['.csv', '.parquet', '.json', '.feather', '.arff']

    if file_extension not in supported_extensions:
        return jsonify({"msg": 'format not supported'})

    elif file_extension == '.arff':
        with open(path, "r") as arff_file:
            arff_dict = arff.load(arff_file)
        attribute_names, dtypes = zip(*arff_dict["attributes"])
        data = pd.DataFrame(arff_dict["data"], columns=attribute_names)
        data = pd.DataFrame(arff_dict["data"], columns=attribute_names)
        for attribute_name, dtype in arff_dict["attributes"]:
            # 'real' and 'numeric' are probably interpreted correctly.
            # Date support needs to be added.
            if isinstance(dtype, list):
                data[attribute_name] = data[attribute_name].astype("category")
        df = data

    elif file_extension == '.csv':
        df = pd.read_csv(path)

    elif file_extension == '.json':
        df = pd.read_json(path)

    elif file_extension == '.parquet':
        df = pd.read_parquet(path)

    elif file_extension == '.feather':
        df = pd.read_feather(path)

    oml_dataset = openml.datasets.create_dataset(name=dataset_name,
                                                 description=description,
                                                 data=df, creator=creator,
                                                 contributor=contributor,
                                                 collection_date=collection_date,
                                                 licence=licence,
                                                 language=language,
                                                 attributes='auto',
                                                 default_target_attribute=def_tar_att,
                                                 ignore_attribute=ignore_attribute,
                                                 citation=citation)
    oml_dataset.publish()
    print(path)
    os.remove(path)
    # TODO Add error for bad dataset
    return jsonify({"msg": 'dataset uploaded'}), 200
