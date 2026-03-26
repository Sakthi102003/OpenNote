from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List
import uuid
import secrets
from ...models import note as note_model
from ...schemas import note as note_schema
from ..deps import get_db, get_current_user
from ...models import user as user_model

router = APIRouter()

@router.get("/", response_model=List[note_schema.Note])
def read_notes(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: user_model.User = Depends(get_current_user)
):
    notes = db.query(note_model.Note).filter(note_model.Note.user_id == current_user.id).offset(skip).limit(limit).all()
    return notes

@router.post("/", response_model=note_schema.Note)
def create_note(
    note: note_schema.NoteCreate, 
    db: Session = Depends(get_db), 
    current_user: user_model.User = Depends(get_current_user)
):
    db_note = note_model.Note(**note.dict(), user_id=current_user.id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@router.get("/public/{slug}", response_model=note_schema.Note)
def read_public_note(
    slug: str,
    db: Session = Depends(get_db)
):
    """Get a public note by its share slug"""
    note = db.query(note_model.Note).filter(
        note_model.Note.share_slug == slug,
        note_model.Note.is_public == True
    ).first()
    if not note:
        raise HTTPException(status_code=404, detail="Public note not found")
    return note

@router.get("/{note_id}", response_model=note_schema.Note)
def read_note(
    note_id: str, 
    db: Session = Depends(get_db), 
    current_user: user_model.User = Depends(get_current_user)
):
    note = db.query(note_model.Note).filter(note_model.Note.id == note_id, note_model.Note.user_id == current_user.id).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.delete("/{note_id}", response_model=note_schema.Note)
def delete_note(
    note_id: str, 
    db: Session = Depends(get_db), 
    current_user: user_model.User = Depends(get_current_user)
):
    note = db.query(note_model.Note).filter(note_model.Note.id == note_id, note_model.Note.user_id == current_user.id).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return note

@router.put("/{note_id}", response_model=note_schema.Note)
def update_note(
    note_id: str, 
    note: note_schema.NoteUpdate, 
    db: Session = Depends(get_db), 
    current_user: user_model.User = Depends(get_current_user)
):
    db_note = db.query(note_model.Note).filter(note_model.Note.id == note_id, note_model.Note.user_id == current_user.id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    update_data = note.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_note, key, value)
    
    db.commit()
    db.refresh(db_note)
    return db_note

@router.post("/{note_id}/blocks", response_model=note_schema.Block)
def create_block(
    note_id: str,
    block: note_schema.BlockCreate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    # Check if note exists and belongs to user
    note = db.query(note_model.Note).filter(note_model.Note.id == note_id, note_model.Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    db_block = note_model.Block(**block.dict(), note_id=note_id)
    db.add(db_block)
    # Update note updated_at
    note.updated_at = func.now()
    db.commit()
    db.refresh(db_block)
    return db_block

@router.post("/{note_id}/toggle-public", response_model=note_schema.Note)
def toggle_note_public(
    note_id: str,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    """Toggle note public/private status and generate share slug if making public"""
    note = db.query(note_model.Note).filter(note_model.Note.id == note_id, note_model.Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    note.is_public = not note.is_public
    
    # Generate share slug if making public and doesn't have one
    if note.is_public and not note.share_slug:
        note.share_slug = secrets.token_urlsafe(8)
    
    db.commit()
    db.refresh(note)
    return note

@router.post("/{note_id}/fork", response_model=note_schema.Note)
def fork_note(
    note_id: str,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    """Fork a public note into the current user's workspace"""
    # Get the original note (must be public)
    original_note = db.query(note_model.Note).filter(note_model.Note.id == note_id).first()
    if not original_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    if not original_note.is_public:
        raise HTTPException(status_code=403, detail="Only public notes can be forked")
    
    # Create a copy for the current user
    forked_note = note_model.Note(
        user_id=current_user.id,
        title=f"{original_note.title} (Copy)",
        content=original_note.content,
        is_public=False,
        forked_from_id=original_note.id
    )
    
    db.add(forked_note)
    db.commit()
    db.refresh(forked_note)
    return forked_note
