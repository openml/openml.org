import datetime
import hashlib
import os
from distutils.util import strtobool
from urllib.parse import parse_qs, urlparse

from flask import Blueprint, jsonify, request, send_from_directory, abort, Response
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    get_jwt,
    jwt_required,
)
from pathlib import Path

from server.extensions import Session

from server.extensions import jwt
from server.user.models import User, UserGroups
from server.utils import confirmation_email
from werkzeug.utils import secure_filename
from PIL import Image
from io import BytesIO

user_blueprint = Blueprint(
    "user", __name__, static_folder="server/src/client/app/build"
)


CORS(user_blueprint)

blocklist = set()


@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    """Checking if token is in blocklist token"""
    jti = decrypted_token["jti"]
    return jti in blocklist


@user_blueprint.route("/login", methods=["POST"])
def login():
    """
    Login

    1. Takes the Json request with email and password
    2. Checks password and if user is confirmed
    3. Logs in user next with access token
    """

    jobj = request.get_json()
    with Session() as session:
        user = session.query(User).filter_by(email=jobj["email"]).first()
        print(jobj)
        if user is None:
            print("user does not exist")
            return jsonify({"msg": "Wrong username or password"}), 200

        elif not user.check_password(jobj["password"]):
            print("Wrong password")
            return jsonify({"msg": "wrong password"}), 200

        elif user.active == 0:
            print("User not confirmed")
            return jsonify({"msg": "NotConfirmed"}), 200

        else:
            user_g = session.query(UserGroups).filter_by(user_id=user.id).first()
            if user_g is None:
                user_ = UserGroups(user_id=user.id)
                user_.set_group()
                session.add(user_)
                session.commit()
            access_token = create_access_token(identity=user.email)
            testing = strtobool(os.environ.get("TESTING", "True"))
            print(testing)
            if testing:
                print("executed")
                os.environ["TEST_ACCESS_TOKEN"] = access_token
                # exporting access token to environment for testing
            return jsonify(access_token=access_token), 200


@user_blueprint.route("/profile", methods=["GET", "POST"])
@jwt_required()
def profile():
    """
    Function to edit and retrieve user profile information
    """
    current_user = get_jwt_identity()
    with Session() as session:
        user = session.query(User).filter_by(email=current_user).first()
        if request.method == "GET":
            return (
                jsonify(
                    {
                        "username": user.email,
                        "bio": user.bio,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "image": user.image,
                        "id": user.id,
                    }
                ),
                200,
            )
        elif request.method == "POST":
            data = request.get_json()
            # print(data['image'])
            user.update_bio(data["bio"])
            user.update_first_name(data["first_name"])
            user.update_last_name(data["last_name"])
            if data["email"] != user.email:
                print("email changed")
                timestamp = datetime.datetime.now()
                timestamp = timestamp.strftime("%d %H:%M:%S")
                md5_digest = hashlib.md5(timestamp.encode()).hexdigest()
                user.update_activation_code(md5_digest)
                confirmation_email(data["email"], md5_digest)
                user.update_email(data["email"])

            session.merge(user)
            session.commit()
            return jsonify({"msg": "User information changed"}), 200
        else:
            return jsonify({"msg": "profile OK"}), 200


@jwt_required()
@user_blueprint.route("/verifytoken", methods=["GET"])
def verifytoken():
    return "token-valid"


# TODO Change Address before production
@user_blueprint.route("/image", methods=["POST"])
@jwt_required()
def image():
    """Function to receive and set user image"""
    current_user = get_jwt_identity()
    with Session() as session:
        user = session.query(User).filter_by(email=current_user).first()
        f = request.files["file"]
        Path("dev_data/" + str(user.email)).mkdir(parents=True, exist_ok=True)
        f.save(
            os.path.join("dev_data/" + str(user.email) + "/", secure_filename(f.filename))
        )
        path = "imgs/dev_data/" + str(user.email) + "/" + secure_filename(f.filename)
        user.update_image_address(path)
        session.merge(user)
        session.commit()
    return jsonify({"msg": "User image changed"}), 200


@user_blueprint.route("/imgs/<path:path>")
def images(path):
    try:
        im = Image.open(path)
        # im.thumbnail((w, h), Image.ANTIALIAS)
        io = BytesIO()
        im.save(io, format="JPEG")
        return Response(io.getvalue(), mimetype="image/jpeg")

    except IOError:
        abort(404)

    return send_from_directory(".", path)


@user_blueprint.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Function to logout user"""
    jti = get_jwt()["jti"]
    blocklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200


@user_blueprint.route("/api-key", methods=["POST", "GET"])
@jwt_required()
def apikey():
    """Change and retrieve API-Key"""
    current_user = get_jwt_identity()
    with Session() as session:
        user = session.query(User).filter(User.email == current_user).first()
        if request.method == "GET":
            api_key = user.session_hash
            return jsonify({"apikey": api_key}), 200
        elif request.method == "POST":
            user.set_session_hash()
            session.merge(user)
            session.commit()
            return jsonify({"msg": "API Key updated"}), 200


@user_blueprint.route("/delete", methods=["GET", "POST"])
@jwt_required()
def delete_user():
    """Delete current user: Frontend and functionality not decided yet"""
    # current_user = get_jwt_identity()
    # user = session.query(User).filter(User.email == current_user).first()
    # session.delete(user)
    # session.commit()
    return jsonify({"msg": "User deleted"}), 200


@user_blueprint.route("/forgot-token", methods=["POST"])
def forgot_token():
    """Check for forgotten_password_code"""
    data = request.get_json()
    with Session() as session:
        user = user_from_token(session, data, "forgotten_password_code")
    if user is not None:
        return jsonify({"msg": "token confirmed"}), 200
    else:
        return jsonify({"msg": "Error"}), 401


@user_blueprint.route("/resetpassword", methods=["POST"])
def reset():
    """Changes user password"""
    data = request.get_json()
    with Session() as session:
        user = user_from_token(session, data, "forgotten_password_code")
        user.set_password(data["password"])
        session.merge(user)
        session.commit()
    return jsonify({"msg": "password changed"}), 200


@user_blueprint.route("/confirmation", methods=["POST"])
def confirm_user():
    """Activates user"""
    data = request.get_json()
    with Session() as session:
        user = user_from_token(session, data, "activation_code")
        user.update_activation()
        session.merge(user)
        session.commit()
    return jsonify({"msg": "User confirmed"}), 200


def user_from_token(session: Session, data, token_name):
    url = data["url"]
    parsed = urlparse(url)
    (token, ) = parse_qs(parsed.query)["token"]

    user = session.query(User).filter_by(**{token_name: token}).first()
    if not user:
        raise ValueError(f"No user found for {token_name} {token}")
    return user
