from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base
import uuid
import enum

def generate_uuid():
    return str(uuid.uuid4())

class BlockType(str, enum.Enum):
    paragraph = "text"
    heading1 = "heading1"
    heading2 = "heading2"
    heading3 = "heading3"
    bullet = "bullet"
    todo = "todo"
    code = "code"

class Note(Base):
    __tablename__ = "notes"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, default="Untitled")
    is_public = Column(Boolean, default=False)
    parent_id = Column(String, ForeignKey("notes.id"), nullable=True)
    forked_from_id = Column(String, ForeignKey("notes.id"), nullable=True)
    share_slug = Column(String, unique=True, index=True, nullable=True)
    content = Column(String, nullable=True) # Full TipTap JSON/HTML for MVP simplify
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="notes")
    blocks = relationship("Block", back_populates="note", cascade="all, delete-orphan", order_by="Block.order")
    
    # Self-referential relationship for nested notes
    children = relationship("Note", backref="parent", remote_side=[id], foreign_keys=[parent_id])

    # Relationship to track where this note was forked from (if any)
    original_note = relationship("Note", remote_side=[id], foreign_keys=[forked_from_id])

class Block(Base):
    __tablename__ = "blocks"

    id = Column(String, primary_key=True, default=generate_uuid)
    note_id = Column(String, ForeignKey("notes.id"), nullable=False)
    type = Column(String, nullable=False) # Use string to avoid enum issues, enforce in schema
    content = Column(String, nullable=True) # JSON content stored as string or JSON type if using Postgres
    props = Column(String, nullable=True) # JSON properties (e.g. checked state)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    note = relationship("Note", back_populates="blocks")

class NoteFork(Base):
    __tablename__ = "note_forks"

    id = Column(String, primary_key=True, default=generate_uuid)
    original_note_id = Column(String, ForeignKey("notes.id"), nullable=False)
    forked_note_id = Column(String, ForeignKey("notes.id"), nullable=False)
    forked_by_user_id = Column(String, ForeignKey("users.id"), nullable=False)
    forked_at = Column(DateTime(timezone=True), server_default=func.now())

    forked_by_user = relationship("User", back_populates="forks_made")
