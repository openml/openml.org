from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (get_jwt_identity, jwt_required)
from server.user.models import User
from werkzeug.utils import secure_filename
from io import BytesIO
from pathlib import Path
import os

data_blueprint = Blueprint("data", __name__, static_folder='server/src/client/app/build')

CORS(data_blueprint)


@data_blueprint.route('/data-upload', methods=['POST'])
@jwt_required
def data_upload():
    """
    Function to save the dataset with apikey and name
    returns: path without api_key
    """
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user_api_key = user.session_hash
    data_file = request.files['file']
    Path("temp_data/").mkdir(parents=True, exist_ok=True)
    data_file.save(os.path.join('temp_data/' + str(user_api_key) + '?', secure_filename(data_file.filename)))
    path = secure_filename(data_file.filename)
    return jsonify({"msg": path}), 200
