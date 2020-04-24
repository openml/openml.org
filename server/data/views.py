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
    data_file = request.files['file']
    Path("temp_data/").mkdir(parents=True, exist_ok=True)
    data_file_name = uuid.uuid4()
    print(data_file_name)
    data_file.save(os.path.join('temp_data/' + str(user_api_key) + '?',
                                secure_filename(data_file.filename)))
    path = secure_filename(data_file.filename)
    return jsonify({"msg": path}), 200


@data_blueprint.route('/data-upload', methods=['POST'])
@jwt_required
def data_upload():
    """
    Function to upload dataset
    """
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user_api_key = user.session_hash
    openml.config.apikey = ''
    # change line below in production
    openml.config.start_using_configuration_for_example()
    data_file = request.files['dataset']
    metadata = request.files['metadata']
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
    attribute = metadata['attribute']
    def_tar_att = metadata['def_tar_att']
    ignore_attribute = metadata['ignore_attribute']
    citation = metadata['citation']
    file_name, file_extension = os.path.splitext(data_file.filename)
    if file_extension == '.csv':
        df = pd.read_csv(path)
        oml_dataset = openml.datasets.create_dataset(name=dataset_name,
                                                     description=description,
                                                     data=df, creator=creator,
                                                     contributor=contributor,
                                                     collection_date=collection_date,
                                                     licence=licence,
                                                     language=language,
                                                     attributes=attribute,
                                                     default_target_attribute=def_tar_att,
                                                     ignore_attribute=ignore_attribute,
                                                     citation=citation)
        oml_dataset.publish()
    print(path)
    os.remove(path)
    # TODO remove dataset after upload
    return jsonify({"msg": 'dataset uploaded'}), 200
