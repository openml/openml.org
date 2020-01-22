from flask import Flask, request, send_from_directory
from .config import Config
from flask_migrate import Migrate
from flask_cors import CORS
import os
from .src.dashboard.dashapp import create_dash_app
from .extensions import argon2, engine, Base, db, jwt
from server import user
from server import public
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_dance.contrib.github import make_github_blueprint, github


def create_app(config_object = Config):

    app = Flask(__name__, static_url_path='', static_folder='src/client/app/build',
                instance_relative_config=True)
    app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))
    CORS(app)
    app.config.from_object(Config)
    register_extensions(app)
    register_blueprints(app)
    return app


def register_extensions(app):
    argon2.init_app(app)
    create_dash_app(app)
    jwt.init_app(app)

    # Database initialisation
    #
    db_session = scoped_session(sessionmaker(autocommit=False,
                                             autoflush=False,
                                             bind=engine))
    Base.query = db_session.query_property()
    db.init_app(app)
    with app.app_context():
        db.create_all()
    def init_db():
        # import all modules here that might define models so that
        # they will be registered properly on the metadata.  Otherwise
        # you will have to import them first before calling init_db()
        Base.metadata.create_all(bind=engine)

    return None

def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(public.views.blueprint)
    app.register_blueprint(user.views.user_blueprint)
    github_bp = make_github_blueprint()
    app.register_blueprint(github_bp, url_prefix="/login")
    return None

