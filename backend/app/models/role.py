from sqlalchemy import Column, String, Text, CheckConstraint
from sqlalchemy.orm import relationship
from app.models.entity_abstract import EntityAbstract
from app.schemas.enum import UserRole

class Role(EntityAbstract):
    __tablename__ = "roles"
    
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    
    users = relationship("User", back_populates="role")

    __table_args__ = (
        CheckConstraint(
            f"name IN ({', '.join([repr(r.value) for r in UserRole])})",
            name="check_role_name"
        ),
    )
