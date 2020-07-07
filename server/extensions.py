import os

import sqlalchemy
from flask_argon2 import Argon2
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

from server.config import Config

basedir = os.path.abspath(os.path.dirname(__file__))
"""
extension.py
Declares extension for Flask App, connects with already existing database
"""
# specifying engine according to existing db
try:
    engine = create_engine(os.environ.get('DATABASE_URI'),
                           convert_unicode=True, echo=False, pool_size=20,
                           max_overflow=0, pool_pre_ping=True)
    Base = declarative_base()
    Base.metadata.reflect(engine)
except sqlalchemy.exc.OperationalError:
    engine = create_engine('sqlite:///' + os.path.join(basedir, 'openml.db'),
                           echo=False, convert_unicode=True)
    Config.SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'openml.db')
    Base = declarative_base()
    Base.metadata.reflect(engine)


argon2 = Argon2()
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
