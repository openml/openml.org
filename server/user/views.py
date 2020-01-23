from flask import Blueprint, request, jsonify, redirect
from server.user.models import User
from flask_cors import CORS
import requests, datetime
from flask_jwt_extended import (jwt_required, create_access_token,
                                get_jwt_identity, get_raw_jwt)
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
        timestamp = datetime.datetime.now()
        timestamp1 = timestamp.strftime("%Y-%m-%d %H:%M:%S")
        user.last_login = timestamp1
        return jsonify(access_token=access_token), 200


@user_blueprint.route('/profile', methods=['GET', 'POST'])
@jwt_required
def profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    if request.method == 'GET':
        return jsonify({"username": user.username, "bio": user.bio, "first_name": user.first_name,
                        "last_name": user.last_name, "email": user.email}), 200
    elif request.method == "POST":
        data = request.get_json()
        user.update_bio(data['bio'])
        user.update_first_name(data['first_name'])
        user.update_last_name(data['last_name'])
        db.session.merge(user)
        db.session.commit()
        return "changes executed"
    else:
        return "post user"


@user_blueprint.route('/logout', methods=['GET'])
@jwt_required
def logout():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200


@user_blueprint.route('/delete', methods=['GET', 'POST'])
@jwt_required
def delete_user():
    current_user = get_jwt_identity()
    user = db.session.query(User).filter(User.email == current_user).first()
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"}), 200


# TODO Write forgotten pass logic
@user_blueprint.route('/forgot-token', methods=['GET', 'POST'])
def forgot_token():
    token = request.args.get('token')
    user = User.query.filter_by(forgotten_password_code=token).first()
    if user.forgotten_password_code == token:
        return 'CODE CONFIRMED'
    else:
        print('sdfs')
        return "ACCESS DENIED"


# TODO Reset password logic
@user_blueprint.route('/resetpassword')
def reset():
    token = request.args.get('token')
    data = request.get_json()
    user = User.query.filter_by(forgotten_password_code=token).first()
    user.set_password(data['new_password'])
    db.session.merge(user)
    db.session.commit()

# TODO write user confirmation logic


#
