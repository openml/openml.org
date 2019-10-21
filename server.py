from flask import Flask, request
from config import Config
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager, login_user, current_user,logout_user
import os
from src.dash.dashapp import create_dash_app
# from flask_argon2 import Argon2
from extensions import db, loginmgr, argon2

from models import User
app = Flask(__name__, static_url_path='', static_folder='src/client/app/build',
            instance_relative_config=True)
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))
#app.config.from_object('config')
#app.config.from_pyfile('config.py')

# Create dash App
db.init_app(app)
app.config.from_object(Config)
# CORS initialisation
CORS(app)
argon2.init_app(app)

# Login initialisation
loginmgr.init_app(app)
loginmgr.login_view = 'login'
create_dash_app(app)
#Database initialisation

migrate = Migrate(app, db)


app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("src/client/" + path):
        return send_from_directory('src/client', path)
    else:
        return send_from_directory('src/client', 'index.html')

@app.route('/signup', methods=['POST', 'GET'])
def signupfunc():
    if request.method =='POST':
        print(request.get_json())
        robj = request.get_json()
        user = User(username=robj['name'], email=robj['email'])
        user.set_password(robj['password'])
        db.session.add(user)
        db.session.commit()

    return 'request'


@app.route('/login', methods=['POST', 'GET'])
def login():
    if current_user.is_authenticated:
        print('alreadyauth')
        return 'already auth'
    if request.method =='POST':
        print(request.get_json())
        jobj = request.get_json()
        user = User.query.filter_by(email=jobj['email']).first()
        login_user(user, remember=True)
        print('loggedin')
        return 'loggedin'

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.secret_key='abcd'
    app.run(port=int(os.environ.get("PORT", 5000)), debug=True)
