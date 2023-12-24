# schemas.py
from pydantic import BaseModel
from datetime import datetime

class RecordBase(BaseModel):
    question: str
    answer: str
    content: str

class RecordCreate(RecordBase):
    question: str
    answer: str
    content: str
    


class Record(RecordBase):
    id: int
    timestamp: datetime
    created_at: datetime
    updated_at: datetime


class Transcription(BaseModel):
    id: int
    text: str
    created_at: datetime

class TranscriptionCreate(BaseModel):
    text: str


class Config:
    orm_mode = True

class DeleteStatus(BaseModel):
    ok: bool
