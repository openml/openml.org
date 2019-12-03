from flask import (
    Blueprint,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    url_for,
)
from flask_login import login_required, login_user, logout_user
from server.user.models import User
from server.extensions import login_manager, db

blueprint = Blueprint("public", __name__)



@blueprint.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("src/client/" + path):
        return send_from_directory('src/client', path)
    else:
        return send_from_directory('src/client', 'index.html')


@blueprint.route('/signup', methods=['POST', 'GET'])
def signupfunc():
    if request.method == 'POST':
        robj = request.get_json()
        user = User(username=robj['name'], email=robj['email'])
        user.set_password(robj['password'])
        # max_id = db.session.query(db.func.max(User.id)).scalar()
        # user.set_user_id(max_id)
        db.session.add(user)
        db.session.commit()
        print('signedup')
        return 'signedup'
    return 'notyet'





@blueprint.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))