from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (get_jwt_identity, jwt_required)
from server.user.models import User
import openml

task_blueprint = Blueprint("task", __name__, static_folder='server/src/client/app/build')

CORS(task_blueprint)


@task_blueprint.route('/upload-task', methods=['POST'])
@jwt_required
def upload_task():
    """
    Function to upload task
    TODO: test for all possible tasks
    """
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user_api_key = user.session_hash
    openml.config.apikey = user_api_key
    # change line below in testing
    # openml.config.start_using_configuration_for_example()
    data = request.get_json()
    tasktypes = openml.tasks.TaskTypeEnum
    type = data['task_type']
    task_type = ''
    if type == 'regression':
        task_type = tasktypes.SUPERVISED_REGRESSION
    elif type == 'classification':
        task_type = tasktypes.SUPERVISED_CLASSIFICATION
    elif type == 'clustering':
        task_type = tasktypes.CLUSTERING
    elif type == 'learningcurve':
        task_type = tasktypes.LEARNING_CURVE

    # Task Type Mapping here:
    # https://github.com/openml/openml-python/blob/develop/openml/tasks/task.py
    dataset_ids = data['dataset_id']
    dataset_ids = int(dataset_ids)
    target_name = data['target_name']
    evaluation_measure = data['evaluation_measure']
    estimation = 1
    try:
        task = openml.tasks.create_task(target_name=target_name,
                                        task_type_id=task_type,
                                        dataset_id=dataset_ids,
                                        evaluation_measure=evaluation_measure,
                                        estimation_procedure_id=estimation)
        task.publish()
        return jsonify({'msg': 'task uploaded'})

    except openml.exceptions.OpenMLServerException as e:
        # Error code for 'task already exists'
        if e.code == 614:
            # Lookup task
            tasks = openml.tasks.list_tasks(data_id=128, output_format='dataframe')
            tasks = tasks.query('task_type == "Supervised Classification" '
                                'and estimation_procedure == "10-fold Crossvalidation" '
                                'and evaluation_measures == "predictive_accuracy"')
            task_id = tasks.loc[:, "tid"].values[0]
            return jsonify({'msg': 'task exists'})

