from flask_sqlalchemy import SQLAlchemy
from flask_argon2 import Argon2
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#specifying engine according to existing db
engine = create_engine('mysql+pymysql://root:''@localhost/openml', convert_unicode=True, echo=False)
Base = declarative_base()
Base.metadata.reflect(engine)

argon2 = Argon2()
db = SQLAlchemy()


