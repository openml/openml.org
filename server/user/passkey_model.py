from server.extensions import Base

class UserPasskey(Base):
    __table__ = Base.metadata.tables["user_passkeys"]
    __table_args__ = {"autoload": True}
    
    def __repr__(self):
        return f"<UserPasskey {self.device_name} for user {self.user_id}>"
