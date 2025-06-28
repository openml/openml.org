import os
import secrets
from distutils.util import strtobool

from flask_cors import CORS

from server.extensions import Session
from server.src.dashboard.helpers import logger
from server.user.models import User, UserGroups
from server.utils import confirmation_email, forgot_password_email, send_feedback

from flask import (  # current_app,; flash,; redirect,; render_template,; url_for,
    Blueprint,
    jsonify,
    request,
)


blueprint = Blueprint("public", __name__)


CORS(blueprint)


DO_SEND_EMAIL = strtobool(os.environ.get("SEND_EMAIL", "True"))


@blueprint.route("/signup", methods=["POST"])
def signupfunc():
    """Registering user and checking for already existing user"""
    register_obj = request.get_json()
    with Session() as session:
        check_user = session.query(User).filter_by(email=register_obj["email"]).first()
        if check_user is None:
            user = User(username=register_obj["email"], email=register_obj["email"])
            user.set_password(register_obj["password"])
            user.set_session_hash()
            user.ip_address = request.remote_addr
            user.activation_selector = None
            user.activation_code = "0000"
            user.forgotten_password_selector = None
            user.forgotten_password_code = "0000"
            user.forgotten_password_time = "0000"
            user.remember_selector = None
            user.remember_code = "0000"
            user.created_on = "0000"
            user.last_login = "0000"
            user.active = "0" if DO_SEND_EMAIL else "1"
            user.first_name = register_obj["first_name"]
            user.last_name = register_obj["last_name"]
            user.company = "0000"
            user.phone = "0000"
            user.country = "0000"
            user.image = "0000"
            user.bio = "No Bio"
            user.core = "0000"
            user.external_source = "0000"
            user.external_id = "0000"
            user.password_hash = "0000"
            token = secrets.token_hex()
            user.update_activation_code(token)
            if DO_SEND_EMAIL:
                confirmation_email(user.email, token)
            session.add(user)
            session.commit()

            return jsonify({"msg": "User created"}), 200
        else:
            return jsonify({"msg": "User already exists"}), 200


@blueprint.route("/forgotpassword", methods=["POST"])
def password():
    """Sending forgotten password code"""
    jobj = request.get_json()
    with Session() as session:
        user = session.query(User).filter_by(email=jobj["email"]).first()
        if not user:
            logger.warning(f"No user found with email {jobj['email']}")
            return jsonify({"msg": "Token sent"}), 200  # not leaking info if email exists
        token = secrets.token_hex()
        user.update_forgotten_code(token)
        # user.update_forgotten_time(timestamp)
        if DO_SEND_EMAIL:
            forgot_password_email(user.email, token)
        session.merge(user)
        session.commit()
    return jsonify({"msg": "Token sent"}), 200


@blueprint.route("/send-confirmation-token", methods=["POST"])
def confirmation_token():
    """Sending confirmation token again"""
    jobj = request.get_json()
    with Session() as session:
        user = session.query(User).filter_by(email=jobj["email"]).first()
        if not user:
            logger.warning(f"No user found with email {jobj['email']}")
            # not leaking info if email exists
            return jsonify({"msg": "User confirmation token sent"}), 200
        token = secrets.token_hex()
        user.update_activation_code(token)
        if DO_SEND_EMAIL:
            confirmation_email(user.email, token)
        # updating user groups here
        user_group = UserGroups(user_id=user.id, group_id=2)
        session.merge(user)
        session.add(user_group)
        session.commit()
    return jsonify({"msg": "User confirmation token sent"}), 200


@blueprint.route("/feedback", methods=["POST"])
def feedback():
    jobj = request.get_json()
    email = jobj["email"]
    feedback_msg = jobj["feedback"]
    send_feedback(email, feedback_msg)
    return jsonify({"msg": "Email sent"}), 200
