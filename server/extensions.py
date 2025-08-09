import logging
import os
from distutils.util import strtobool

from dotenv import load_dotenv

# import sqlalchemy
from flask_argon2 import Argon2
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from server.config import Config

basedir = os.path.abspath(os.path.dirname(__file__))
"""
extension.py
Declares extension for Flask App, connects with already existing database
"""
# specifying engine according to existing db
environment = os.environ.get("environment", "")
load_dotenv(f".env{environment}")


if not strtobool(os.environ.get("TESTING", "True")):
    engine = create_engine(
        os.environ.get("DATABASE_URI"),
        echo=False,
        pool_size=20,
        max_overflow=0,
        pool_pre_ping=True,
    )
    Base = declarative_base()
    Base.metadata.reflect(engine)
else:
    logging.warning("Testing mode, using local sqlite db.")
    engine = create_engine(
        "sqlite:///" + os.path.join(basedir, "openml.db"),
        echo=False,
    )
    Config.SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "openml.db")
    Base = declarative_base()
    Base.metadata.reflect(engine)


Session = sessionmaker(autoflush=False, bind=engine)

argon2 = Argon2()
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
