from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (get_jwt_identity, jwt_required)
from server.user.models import User
from werkzeug.utils import secure_filename
from pathlib import Path
import os
import uuid
import openml
import pandas as pd
import json
import arff

data_blueprint = Blueprint("data", __name__, static_folder='server/src/client/app/build')

CORS(data_blueprint)


@data_blueprint.route('/data-edit-upload', methods=['POST'])
@jwt_required
def data_edit_upload():
    """
    Function to save the dataset with apikey and name
    returns: path without api_key
    """
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user_api_key = user.session_hash
    data_file = request.files['dataset']
    metadata = request.files['metadata']
    # metadata = metadata.read()
    # metadata = json.loads(metadata)
    file_name, file_extension = os.path.splitext(data_file.filename)
    data_file_uuid = str(uuid.uuid4())
    Path("temp_data/").mkdir(parents=True, exist_ok=True)
    Path("temp_data/json/").mkdir(parents=True, exist_ok=True)
    data_file.save('temp_data/' + user_api_key + '?' + data_file_uuid + file_extension)
    metadata.save('temp_data/json/' + user_api_key + '?' + data_file_uuid)
    print(data_file_uuid)
    path = str(data_file_uuid)
    return jsonify({"msg": path}), 200


@data_blueprint.route('/data-edit', methods=['POST'])
@jwt_required
def data_edit():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user_api_key = user.session_hash
    j_obj = request.get_json()
    dataset_id = j_obj['dataset_id']
    dataset = openml.datasets.get_dataset(int(dataset_id))

    return 'tested'


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
    openml.config.start_using_configuration_for_example()

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
    #TODO : Support ARFF
    #TODO: Support custom attribute types
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
