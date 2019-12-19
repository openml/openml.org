from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_argon2 import Argon2

argon2 = Argon2()
db = SQLAlchemy()
login_manager = LoginManager()
