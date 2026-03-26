from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
import uuid

class BlockBase(BaseModel):
    type: str # text, heading1, heading2, heading3, bullet, todo, code
    content: Optional[Any] = None
    props: Optional[Any] = None
    order: int

class BlockCreate(BlockBase):
    pass

class Block(BlockBase):
    id: uuid.UUID
    note_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NoteBase(BaseModel):
    title: str
    is_public: bool = False
    parent_id: Optional[uuid.UUID] = None

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    title: Optional[str] = None
    is_public: Optional[bool] = None
    content: Optional[str] = None # Added content update support

class Note(NoteBase):
    id: uuid.UUID
    user_id: uuid.UUID
    share_slug: Optional[str] = None
    content: Optional[str] = None # Added content field
    created_at: datetime
    updated_at: Optional[datetime] = None
    blocks: List[Block] = []
    forked_from_id: Optional[uuid.UUID] = None

    class Config:
        from_attributes = True
