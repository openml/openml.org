from flask_sqlalchemy import SQLAlchemy
from flask_argon2 import Argon2
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_jwt_extended import JWTManager

#specifying engine according to existing db
engine = create_engine('mysql+pymysql://root:''@localhost/openml', convert_unicode=True, echo=False)
Base = declarative_base()
Base.metadata.reflect(engine)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
argon2 = Argon2()
db = SQLAlchemy()
jwt = JWTManager()
# TODO: cleanup code and find which session is useful and which is not
