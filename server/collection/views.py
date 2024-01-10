import uuid

import openml
from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import jwt_required

from server.setup import setup_openml_config

collection_bp = Blueprint(
    "collection", __name__, static_folder="server/src/client/app/build"
)

CORS(collection_bp)


@collection_bp.before_request
def setup():
    setup_openml_config()


@collection_bp.route("/upload-collection-runs", methods=["POST"])
@jwt_required()
def upload_collection_runs():
    """
    Function to upload the collection_runs
    returns: JSON response
    """
    data = request.get_json()
    collection_name = data["collectionname"]
    description = data["description"]
    run_ids = data["run_ids"]
    benchmark = data["benchmark"]
    run_ids = [int(s) for s in run_ids.split(",")]
    print(run_ids)
    alias = uuid.uuid4().hex
    study = openml.study.create_study(
        alias=alias,
        benchmark_suite=int(benchmark),
        name=collection_name,
        description=description,
        run_ids=run_ids,
    )
    study.publish()
    return jsonify({"msg": "collection uploaded"}), 200


@collection_bp.route("/upload-collection-tasks", methods=["POST"])
@jwt_required()
def upload_collection_task():
    """
    Function to upload the collection_tasks
    returns: JSON response
    """
    data = request.get_json()
    collection_name = data["collectionname"]
    description = data["description"]
    task_ids = data["taskids"]
    task_ids = [int(s) for s in task_ids.split(",")]
    print(task_ids)
    alias = uuid.uuid4().hex
    study = openml.study.create_benchmark_suite(
        alias=alias, name=collection_name, description=description, task_ids=task_ids
    )
    study.publish()
    return jsonify({"msg": "collection uploaded"}), 200
