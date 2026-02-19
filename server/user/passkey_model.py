from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from server.extensions import Base

class UserPasskey(Base):
    __tablename__ = "user_passkeys"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    credential_id = Column(LargeBinary, nullable=False, unique=True)
    public_key = Column(LargeBinary, nullable=False)
    sign_count = Column(Integer, default=0)
    transports = Column(String(255))  # Comma-separated list of transports
    device_name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="passkeys")

    def __repr__(self):
        return f"<UserPasskey {self.device_name} for user {self.user_id}>"
