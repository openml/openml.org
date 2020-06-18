from sqlalchemy.orm import scoped_session, sessionmaker

from server import public, user, data, collection, task
from .extensions import Base, argon2, bcrypt, db, engine, jwt
from .src.dashboard.dashapp import create_dash_app
# from flask_cors import CORS
# from flask_dance.contrib.github import make_github_blueprint, github


def register_extensions(app):
    """Registering extensions for flask app

    Keyword arguments:
        app -- Flask app
    """
    argon2.init_app(app)
    create_dash_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Database initialisation
    db_session = scoped_session(sessionmaker(autocommit=False,
                                             autoflush=False,
                                             bind=engine))
    Base.query = db_session.query_property()
    db.init_app(app)
    with app.app_context():
        db.create_all()

    def init_db():
        """" Import all modules here that might define models so that
        they will be registered properly on the metadata.  Otherwise
        you will have to import them first before calling init_db()"""
        Base.metadata.create_all(bind=engine)

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
