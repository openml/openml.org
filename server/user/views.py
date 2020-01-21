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
from server.extensions import db



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
    user = User.query.filter_by(email=current_user).first()
    if request.method == 'GET':
        print(current_user)
        print('profile executed')
        return jsonify({"username":user.username, "bio":user.bio, "first_name":user.first_name, "last_name":user.last_name, "email":user.email}), 200
    elif request.method == "POST":
        data = request.get_json()
        print(data)
        user.bio = data['bio']
        db.session.commit()
        return "changes executed"
    else:
        return "post user"

