from server.extensions import Base
from server.extensions import argon2
# from sqlalchemy import Column, Integer, String
import hashlib
import datetime
from server.extensions import bcrypt


class User(Base):
    __table__ = Base.metadata.tables['users']
    __table_args__ = {'autoload': True}

    # Attribute names to help out with functions
    # id = Column(Integer, primary_key=True, unique=True)
    # ip_address = Column(String(64))
    # username = Column(String(64), index=True, unique=True)
    # email = Column(String(120), index=True, unique=True)
    # password = Column(String(240))
    # activation_selector = Column(String(120))#Unique
    # activation_code = Column(String(120))
    # forgotten_password_selector = Column(String(120))#Unique
    # forgotten_password_code = Column(String(120))
    # forgotten_password_time = Column(String(120))
    # remember_selector = Column(String(120))#Unique
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
    # session_hash = Column(String(120))# session hash is API key
    # password_hash = Column(String(120))

    def set_password(self, password):
        self.password = argon2.generate_password_hash(password)

    def check_password(self, passwd):
        try:
            if bcrypt.check_password_hash(self.password, passwd):
               bpass = True
        except ValueError as error:
            print(error)
            bpass = False
    # password = argon2.generate_password_hash(password)
        if argon2.check_password_hash(self.password, passwd):
            return True
        elif not argon2.check_password_hash(self.password, passwd) and not bpass:
            return False
        elif not argon2.check_password_hash(self.password, passwd) and bpass:
            self.set_password(passwd)
            return True

    def update_bio(self, new_bio):
        self.bio = new_bio

    def update_first_name(self, first_name):
        self.first_name = first_name

    def update_last_name(self, last_name):
        self.last_name = last_name

    def update_forgotten_code(self, code):
        self.forgotten_password_code = code

    def update_activation_code(self, code):
        self.activation_code = code

    def update_activation(self):
        self.active = '1'

    def update_forgotten_time(self, time):
        self.forgotten_password_time = time

    def set_session_hash(self):
        timestamp = datetime.datetime.now()
        timestamp1 = timestamp.strftime("%Y-%m-%d %H:%M:%S")
        md5_digest = hashlib.md5(timestamp1.encode()).hexdigest()
        self.session_hash = md5_digest

    def __repr__(self):
        return '<User {}>'.format(self.username)
