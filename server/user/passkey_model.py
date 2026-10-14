from server.extensions import Base

class UserPasskey(Base):
    __tablename__ = "user_passkeys"
    
    def __repr__(self):
        return f"<UserPasskey {self.device_name} for user {self.user_id}>"
