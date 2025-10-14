from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.entity_abstract import EntityAbstract
from app.models.role import Role
from app.models.time_adjustment import TimeAdjustment

class User(EntityAbstract):
    __tablename__ = "users"

    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=True)

    role = relationship("Role", back_populates="users")
    
    time_records = relationship("TimeTracking", back_populates="user")
    time_adjustments = relationship(
        "TimeAdjustment",
        back_populates="user",
        foreign_keys="[TimeAdjustment.user_id]"
    )
    time_off_requests = relationship(
        "TimeOffRequest",
        back_populates="user",
        foreign_keys="[TimeOffRequest.user_id]"  
    )
    
    reviews_done = relationship(
        "TimeOffRequest",
        back_populates="reviewer",
        foreign_keys="[TimeOffRequest.reviewed_by]"  
    )

    leave_balances = relationship(
    "LeaveBalance",
    back_populates="user",
    cascade="all, delete-orphan"
    )
