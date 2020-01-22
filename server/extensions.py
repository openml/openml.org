from flask_sqlalchemy import SQLAlchemy
from flask_argon2 import Argon2
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_jwt_extended import JWTManager

#specifying engine according to existing db
password = "1993sahi11"
engine = create_engine('mysql+pymysql://root:''@localhost/openml', convert_unicode=True, echo=False, pool_size=20, max_overflow=0)
Base = declarative_base()
Base.metadata.reflect(engine)
argon2 = Argon2()
db = SQLAlchemy()
jwt = JWTManager()
