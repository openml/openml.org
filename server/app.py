from server import public, user, data, collection, task
from .extensions import argon2, bcrypt, db, jwt
from .src.dashboard.dashapp import create_dash_app


def register_extensions(app):
    """Registering extensions for flask app

    Keyword arguments:
        app -- Flask app
    """
    argon2.init_app(app)
    create_dash_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    db.init_app(app)
    with app.app_context():
        db.create_all()
    return None


def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(public.views.blueprint)
    app.register_blueprint(user.views.user_blueprint)
    app.register_blueprint(data.views.data_blueprint)
    app.register_blueprint(collection.views.collection_bp)
    app.register_blueprint(task.views.task_blueprint)
    # github_bp = make_github_blueprint(redirect_url='/github-login')
    # CORS(github_bp)
    # app.register_blueprint(github_bp, url_prefix="/login")
    return None


# TODO write code for already existing dataset tasks and collections
