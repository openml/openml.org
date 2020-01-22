from flask import Flask, request, send_from_directory
from .config import Config
from flask_migrate import Migrate
from flask_cors import CORS
import os
from .src.dashboard.dashapp import create_dash_app
from .extensions import db, login_manager, argon2
from server import user
from server import public
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity)


def register_extensions(app):
    argon2.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'user.login'

    create_dash_app(app)
    # Database initialisation
    db.init_app(app)
    migrate = Migrate(app, db)
    with app.app_context():
        db.create_all()
    return None


def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(public.views.blueprint)
    app.register_blueprint(user.views.user_blueprint)
    return None

