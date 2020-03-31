import datetime
import hashlib
import os
from urllib.parse import parse_qs, urlparse

from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                get_raw_jwt, jwt_required)

from server.extensions import db, jwt
from server.user.models import User
from server.utils import confirmation_email

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
    print(user.active)
    if user is None or not user.check_password(jobj['password']):
        print("error")
        return jsonify({"msg": "Error"}), 401

    elif user.active == 0:
        print("User not confirmed")
        return jsonify({"msg": "NotConfirmed"}), 200

    else:
        access_token = create_access_token(identity=user.email)
        os.environ['TEST_ACCESS_TOKEN'] = access_token
        print()
        # timestamp = datetime.datetime.now()
        # timestamp1 = timestamp.strftime("%Y-%m-%d")
        # user.last_login = timestamp1
        db.session.merge(user)
        db.session.commit()
        return jsonify(access_token=access_token), 200


# TODO Add user profile picture
@user_blueprint.route('/profile', methods=['GET', 'POST'])
@jwt_required
def profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    if request.method == 'GET':
        return jsonify({"username": user.username, "bio": user.bio, "first_name": user.first_name,
                        "last_name": user.last_name, "email": user.email, "image": user.image}), 200
    elif request.method == "POST":

        data = request.get_json()
        print(data['image'])
        user.update_bio(data['bio'])
        user.update_first_name(data['first_name'])
        user.update_last_name(data['last_name'])
        if data['email'] != user.email:
            print('email changed')
            timestamp = datetime.datetime.now()
            timestamp = timestamp.strftime("%d %H")
            md5_digest = hashlib.md5(timestamp.encode()).hexdigest()
            user.update_activation_code(md5_digest)
            confirmation_email(user.email, md5_digest)

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


@user_blueprint.route('/api-key', methods=['POST', 'GET'])
@jwt_required
def apikey():
    current_user = get_jwt_identity()
    user = db.session.query(User).filter(User.email == current_user).first()
    if request.method == 'GET':
        api_key = user.session_hash
        return jsonify({'apikey': api_key}), 200
    elif request.method == 'POST':
        user.set_session_hash()
        db.session.merge(user)
        db.session.commit()
        return jsonify({"msg": "API Key updated"}), 200


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


@user_blueprint.route('/confirmation', methods=['POST'])
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
