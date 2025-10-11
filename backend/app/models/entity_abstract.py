from sqlalchemy import Column, DateTime, Boolean, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class EntityAbstract(Base):
    __abstract__ = True

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    create_date = Column(DateTime(timezone=True), server_default=func.now())
    update_date = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    delete_date = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False)
    is_disabled = Column(Boolean, default=False)