from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (get_jwt_identity, jwt_required)
from server.user.models import User
import openml
import json
import uuid

collection_blueprint = Blueprint("collection", __name__, static_folder='server/src/client/app/build')

CORS(collection_blueprint)


@collection_blueprint.route('/upload-collection-runs', methods=['POST'])
@jwt_required
def upload_collection_runs():
    """
    Function to upload the collection_runs
    returns: JSON response
    """
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user_api_key = user.session_hash
    # openml.config.apikey = user_api_key
    # TODO change line below in production
    openml.config.start_using_configuration_for_example()
    data = request.get_json()
    collection_name = data['collectionname']
    description = data['description']
    run_ids = data['run_ids']
    benchmark = data['benchmark']
    run_ids = [int(s) for s in run_ids.split(',')]
    print(run_ids)
    alias = uuid.uuid4().hex
    study = openml.study.create_study(alias=alias,
                                      benchmark_suite=int(benchmark),
                                      name=collection_name,
                                      description=description,
                                      run_ids=run_ids)
    study.publish()
    return jsonify({'msg': 'collection uploaded'}), 200


@collection_blueprint.route('/upload-collection-tasks', methods=['POST'])
@jwt_required
def upload_collection_task():
    """
    Function to upload the collection_tasks
    returns: JSON response
    """
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user_api_key = user.session_hash
    # openml.config.apikey = user_api_key
    # TODO change line below in production
    openml.config.start_using_configuration_for_example()
    data = request.get_json()
    collection_name = data['collectionname']
    description = data['description']
    task_ids = data['taskids']
    task_ids = [int(s) for s in task_ids.split(',')]
    print(task_ids)
    alias = uuid.uuid4().hex
    study = openml.study.create_benchmark_suite(alias=alias,
                                                name=collection_name,
                                                description=description,
                                                task_ids=task_ids)
    study.publish()
    return jsonify({'msg': 'collection uploaded'}), 200
