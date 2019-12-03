from flask import Blueprint, render_template, request, Response
from flask_login import login_required, current_user, login_user
from server.user.models import User
from flask_cors import CORS
import requests
from server.extensions import login_manager
user_blueprint = Blueprint("user", __name__)
CORS(user_blueprint)

@login_manager.request_loader
def load_user(request):
    """Load user by ID."""
    print(request)
    username = request.args.get('id')
    user = User.query.filter_by(email=username).first()
    print (user)
    return user


@user_blueprint.route('/login', methods=['POST'])
def login():
    # if current_user.is_authenticated:
    #     print('alreadyauth')
    #     return 'alreadyauth'
    # elif request.method == 'POST':
    jobj = request.get_json()
    user = User.query.filter_by(email=jobj['email']).first()
    if user is None or not user.check_password(jobj['password']):
        print("error")
        return "Error"
    else:
        print(current_user)
        login_user(user, remember=True, force = True)
        print(current_user)
        return 'loggedin'


@user_blueprint.route('/profile', methods=['GET','POST'])
def profile():

    if request.method == 'GET':
        print(current_user)
        print('profile executed')
        return "current_user"
    else:
        return "post user"

