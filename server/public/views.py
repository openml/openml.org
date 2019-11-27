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

blueprint = Blueprint("public", __name__, static_folder="'src/client/app/build'")

@login_manager.user_loader
def load_user(user_id):
    """Load user by ID."""
    return User.get_by_id(int(user_id))

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


@blueprint.route('/login', methods=['POST'])
def login():
    # if current_user.is_authenticated:
    #     print('alreadyauth')
    #     return 'alreadyauth'
    jobj = request.get_json()
    user = User.query.filter_by(email=jobj['email']).first()
    if user is None or not user.check_password(jobj['password']):
        print("error")
        return "Error"
    else:
        login_user(user)
        print('loggedin')
        return 'loggedin'


@blueprint.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))