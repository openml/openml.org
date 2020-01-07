from server.extensions import Base
from flask_login import UserMixin
from server.extensions import argon2
from sqlalchemy import Column, Integer, String


class User(Base):
    __table__ = Base.metadata.tables['users']
    __table_args__ = {'autoload': True}
    # id = Column(Integer, primary_key=True, unique=True)
    # ip_address = Column(String(64))
    # username = Column(String(64), index=True, unique=True)
    # email = Column(String(120), index=True, unique=True)
    # password = Column(String(240))
    # activation_selector = Column(String(120))
    # activation_code = Column(String(120))
    # forgotten_password_selector = Column(String(120))
    # forgotten_password_code = Column(String(120))
    # forgotten_password_time = Column(String(120))
    # remember_selector = Column(String(120))
    # remember_code = Column(String(120))
    # created_on = Column(String(120))
    # last_login = Column(String(120))
    # active = Column(String(120))
    # first_name = Column(String(120))
    # last_name = Column(String(120))
    # company = Column(String(120))
    # phone = Column(String(120))
    # country = Column(String(120))
    # image = Column(String(120))
    # bio = Column(String(240))
    # core = Column(String(240))
    # external_source = Column(String(120))
    # external_id = Column(String(120))
    # session_hash = Column(String(120))
    # password_hash = Column(String(120))


    # def set_password(self, password):
    #     self.password_hash = argon2.generate_password_hash(password)
    #
    # def check_password(self, password):
    #     #password = argon2.generate_password_hash(password)
    #     return argon2.check_password_hash(self.password_hash, password)
    #
    # def get_id(self):
    #     print('called')
    #     return self.email
    #
    # def __repr__(self):
    #     return '<User {}>'.format(self.username)


