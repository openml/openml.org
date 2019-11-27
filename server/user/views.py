from flask import Blueprint, render_template
from flask_login import login_required, current_user
from server.user.models import User
blueprint = Blueprint("user", __name__, url_prefix=" ", static_folder="'src/client/app/build'")

@blueprint.route('/signup', methods=['POST', 'GET'])
@login_required
def profile():
    print('profile executed')
    return "current_user"


