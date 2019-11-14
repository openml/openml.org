from flask import Flask, request
from config import Config
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager, login_user, current_user,logout_user
import os
from src.dashboard.dashapp import create_dash_app
from extensions import db, loginmgr, argon2
from models import User

def create_app(config_object = Config):

    app = Flask(__name__, static_url_path='', static_folder='src/client/app/build',
                instance_relative_config=True)
    app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))
    app.config.from_object(Config)
    CORS(app)
    app.route('/', defaults={'path': ''})
    register_extensions(app)
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists("src/client/" + path):
            return send_from_directory('src/client', path)
        else:
            return send_from_directory('src/client', 'index.html')

    @app.route('/signup', methods=['POST', 'GET'])
    def signupfunc():
        if request.method == 'POST':
            robj = request.get_json()
            user = User(username=robj['name'], email=robj['email'])
            user.set_password(robj['password'])
            db.session.add(user)
            db.session.commit()

        return 'request'

    @app.route('/login', methods=['POST'])
    def login():
        # if current_user.is_authenticated:
        #     print('alreadyauth')
        #     return 'alreadyauth'
        jobj = request.get_json()
        user = User.query.filter_by(email=jobj['email']).first()
        if (user is None or not user.check_password(jobj['password'])):
            print("error")
            return "Error"
        else:
            login_user(user)
            print('loggedin')
            return 'loggedin'




    @app.route('/logout')
    def logout():
        logout_user()
        return redirect(url_for('index'))

    return app


def register_extensions(app):
    argon2.init_app(app)
    loginmgr.init_app(app)
    loginmgr.login_view = 'login'
    create_dash_app(app)


    # Database initialisation
    db.init_app(app)
    migrate = Migrate(app, db)
    with app.app_context():
        db.create_all()
    return db





if __name__ == '__main__':
    app = create_app(Config)
    app.secret_key = 'abcd'
    app.run(port=int(os.environ.get("PORT", 5000)), debug=True, ssl_context='adhoc')