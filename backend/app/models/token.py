from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.entity_abstract import EntityAbstract

class Token(EntityAbstract):
    __tablename__ = "tokens"
    
    access_token = Column(String(512), unique=True, nullable=False)
    token_type = Column(String(50), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)