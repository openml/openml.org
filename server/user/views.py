from flask import Blueprint, request, jsonify, redirect, url_for, send_from_directory
from server.user.models import User
from flask_cors import CORS
import requests, datetime
from flask_jwt_extended import (jwt_required, create_access_token,
                                get_jwt_identity, get_raw_jwt)
from server.extensions import db, jwt
from urllib.parse import urlparse, parse_qs

user_blueprint = Blueprint("user", __name__, static_folder='server/src/client/app/build')

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

    # elif user.active=='0':
    #     return jsonify({"msg": "user not confirmed yet"}), 200
    else:
        access_token = create_access_token(identity=user.email)
        timestamp = datetime.datetime.now()
        timestamp1 = timestamp.strftime("%Y-%m-%d")
        # user.last_login = timestamp1
        db.session.merge(user)
        db.session.commit()
        return jsonify(access_token=access_token), 200

#TODO Add user profile picture
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
        return jsonify({"msg": "User information changed"}), 200
    else:
        return jsonify({"msg": "profile OK"}), 200

@user_blueprint.route('/logout', methods=['POST'])
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


@user_blueprint.route('/forgot-token', methods=['POST'])
def forgot_token():
    data = request.get_json()
    url = data['url']
    parsed = urlparse(url)
    token = parse_qs(parsed.query)['token']
    print(token)
    user = User.query.filter_by(forgotten_password_code=token).first()
    if user is not None:
        print('confirmed')
        return jsonify({"msg": "token confirmed"}), 200
    else:
        return jsonify({"msg": "Error"}), 401



@user_blueprint.route('/resetpassword', methods=['POST'])
def reset():
    data = request.get_json()
    print(data)
    url = data['url']
    parsed = urlparse(url)
    token = parse_qs(parsed.query)['token']
    user = User.query.filter_by(forgotten_password_code=token).first()
    user.set_password(data['password'])
    db.session.merge(user)
    db.session.commit()
    return jsonify({"msg": "password changed"}), 200

@user_blueprint.route('/confirmation',  methods=['POST'])
def confirm_user():
    print('confirmation linke')
    data = request.get_json()
    url = data['url']
    parsed = urlparse(url)
    token = parse_qs(parsed.query)['token']
    user = User.query.filter_by(activation_code=token).first()
    user.update_activation()
    db.session.merge(user)
    db.session.commit()
    return jsonify({"msg": "User confirmed"}), 200




#
