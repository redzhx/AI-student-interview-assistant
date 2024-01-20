# schemas.py
from pydantic import BaseModel,UUID4
from datetime import datetime

class RecordBase(BaseModel):
    question: str
    answer: str
    content: str

class RecordCreate(RecordBase):
    pass # 如果没有额外字段，可以省略此处
    

class Record(RecordBase):
    id: UUID4  # 更新为UUID类型
    timestamp: datetime
    created_at: datetime
    updated_at: datetime


class Transcription(BaseModel):
    id: int
    text: str
    created_at: datetime

class TranscriptionCreate(BaseModel):
    text: str



class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class UserCreate(BaseModel):
    username: str
    password: str
    
class UserInDB(User):
    id: UUID4  # 更新为UUID类型
    hashed_password: str



class Config:
    orm_mode = True

class DeleteStatus(BaseModel):
    ok: bool
