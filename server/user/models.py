from server.extensions import db
from flask_login import UserMixin
from server.extensions import argon2


class User(UserMixin, db.Model):

    id = db.Column(db.Integer, primary_key=True, unique=True)
    ip_address = db.Column(db.String(64))
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(240))
    activation_selector = db.Column(db.String(120))
    activation_code = db.Column(db.String(120))
    forgotten_password_selector = db.Column(db.String(120))
    forgotten_password_code = db.Column(db.String(120))
    forgotten_password_time = db.Column(db.String(120))
    remember_selector = db.Column(db.String(120))
    remember_code = db.Column(db.String(120))
    created_on = db.Column(db.String(120))
    last_login = db.Column(db.String(120))
    active = db.Column(db.String(120))
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    company = db.Column(db.String(120))
    phone = db.Column(db.String(120))
    country = db.Column(db.String(120))
    image = db.Column(db.String(120))
    bio = db.Column(db.String(240))
    core = db.Column(db.String(240))
    external_source = db.Column(db.String(120))
    external_id = db.Column(db.String(120))
    session_hash = db.Column(db.String(120))
    password_hash = db.Column(db.String(120))


    def set_password(self, password):
        self.password_hash = argon2.generate_password_hash(password)

    def check_password(self, password):
        #password = argon2.generate_password_hash(password)
        return argon2.check_password_hash(self.password_hash, password)

    def get_id(self):
        print('called')
        return self.email

    def __repr__(self):
        return '<User {}>'.format(self.username)


