from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user, login_user
from server.user.models import User
from flask_cors import CORS
import requests
from flask_jwt_extended import (jwt_required, create_access_token,
    get_jwt_identity
)

user_blueprint = Blueprint("user", __name__)
CORS(user_blueprint)

# @login_manager.request_loader
# def load_user(request):
#     """Load user by ID."""
#     if request.method=='POST':
#         print(request)
#         obj = request.get_json()
#         print(obj)
#         user = User.query.filter_by(email=obj['email']).first()
#         return user
#     else:
#         print('why')
#

@user_blueprint.route('/login', methods=['POST'])
def login():
    jobj = request.get_json()
    user = User.query.filter_by(email=jobj['email']).first()
    if user is None or not user.check_password(jobj['password']):
        print("error")
        return jsonify({"msg": "Error"}), 401

    else:
        access_token = create_access_token(identity=user.email)
        return jsonify(access_token=access_token), 200



@user_blueprint.route('/profile', methods=['GET','POST'])
@jwt_required
def profile():
    current_user = get_jwt_identity()
    if request.method == 'GET':
        print(current_user)
        print('profile executed')
        return "current_user"
    else:
        return "post user"

