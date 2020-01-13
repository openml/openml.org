from flask import Blueprint, render_template, request, jsonify
from server.user.models import User
from flask_cors import CORS
import requests
from flask_jwt_extended import (jwt_required, create_access_token,
    get_jwt_identity
)
from server.extensions import db, jwt


user_blueprint = Blueprint("user", __name__)

CORS(user_blueprint)


blacklist = set()
@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist

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


# TODO: write jwt expiry logic
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


# TODO : write logoput logic
@user_blueprint.route('/logout')
def logout():
    return redirect(url_for('index'))