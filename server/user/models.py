import datetime

# from sqlalchemy import Column, Integer, String
import hashlib

from server.extensions import Base, argon2, bcrypt


class User(Base):
    __table__ = Base.metadata.tables["users"]
    __table_args__ = {"autoload": True}

    def set_password(self, password):
        self.password = argon2.generate_password_hash(password)

    def check_password(self, passwd):
        """
        Check if the passwordhash  is in Argon2 or Bcrypt(old) format
        Resets the password hash to argon2 format if stored in bcrypt
        Returns value for login route
        """
        try:
            if bcrypt.check_password_hash(self.password, passwd):
                bpass = True
        except ValueError as error:
            print(error)
            bpass = False
        if argon2.check_password_hash(self.password, passwd):
            return True
        elif not argon2.check_password_hash(self.password, passwd) and not bpass:
            return False
        elif not argon2.check_password_hash(self.password, passwd) and bpass:
            self.set_password(passwd)
            return True

    def update_bio(self, new_bio):
        self.bio = new_bio

    def update_email(self, email):
        self.email = email

    def update_first_name(self, first_name):
        self.first_name = first_name

    def update_last_name(self, last_name):
        self.last_name = last_name

    def update_forgotten_code(self, code):
        self.forgotten_password_code = code

    def update_activation_code(self, code):
        self.activation_code = code

    def update_activation(self):
        self.active = "1"
        print("user activated successfully")

    def update_forgotten_time(self, time):
        self.forgotten_password_time = time

    def set_session_hash(self):
        timestamp = datetime.datetime.now()
        timestamp1 = timestamp.strftime("%Y-%m-%d %H:%M:%S")
        md5_digest = hashlib.md5(timestamp1.encode()).hexdigest()
        self.session_hash = md5_digest

    def update_image_address(self, path):
        self.image = path

    def __repr__(self):
        return "<User {}>".format(self.username)


class UserGroups(Base):
    __table__ = Base.metadata.tables["users_groups"]
    __table_args__ = {"autoload": True}

    def set_group(self):
        self.group_id = 2
        print('group updated')

    def __repr__(self):
        return "<User {}>".format(self.username)
