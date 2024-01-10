import openml
from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import jwt_required

from server.setup import setup_openml_config

task_blueprint = Blueprint(
    "task", __name__, static_folder="server/src/client/app/build"
)

CORS(task_blueprint)


@task_blueprint.before_request
def setup():
    setup_openml_config()


@task_blueprint.route("/upload-task", methods=["POST"])
@jwt_required()
def upload_task():
    """
    Function to upload task
    """
    data = request.get_json()
    tasktypes = openml.tasks.TaskTypeEnum
    t_type = data["task_type"]
    task_type = ""
    if t_type == "regression":
        task_type = tasktypes.SUPERVISED_REGRESSION
        estimation = 7
    elif t_type == "classification":
        task_type = tasktypes.SUPERVISED_CLASSIFICATION
        estimation = 1
    elif t_type == "clustering":
        estimation = 17
        task_type = tasktypes.CLUSTERING
    elif t_type == "learningcurve":
        task_type = tasktypes.LEARNING_CURVE
        estimation = 13

    # Task Type Mapping here:
    # https://github.com/openml/openml-python/blob/develop/openml/tasks/task.py
    dataset_ids = data["dataset_id"]
    dataset_ids = int(dataset_ids)
    target_name = data["target_name"]
    evaluation_measure = data["evaluation_measure"]
    task = openml.tasks.create_task(
        target_name=target_name,
        task_type_id=task_type,
        dataset_id=dataset_ids,
        evaluation_measure=evaluation_measure,
        estimation_procedure_id=estimation,
    )
    try:
        task.publish()
        return jsonify({"msg": "task uploaded"}), 200

    except openml.exceptions.OpenMLServerException as e:
        # Error code for 'task already exists'
        if e.code == 614:
            # Lookup task
            tasks = openml.tasks.list_tasks(data_id=128, output_format="dataframe")
            tasks = tasks.query(
                'task_type == "Supervised Classification" '
                'and estimation_procedure == "10-fold Crossvalidation" '
                'and evaluation_measures == "predictive_accuracy"'
            )
            return jsonify({"msg": "task exists"}), 200
        elif e.code == 622:
            return jsonify({"msg": "task not supported"}), 200
        else:
            print(e)
            return str(e)
