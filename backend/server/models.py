# models.py
from sqlalchemy import Column, Integer, String, DateTime, Text, func
from .database import Base
from datetime import datetime

class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, index=True)
    answer = Column(String, index=True)  # 注意拼写
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime(timezone=False), server_default=func.now())
    updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now())



class Transcription(Base):
    __tablename__ = "transcriptions"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text)  # 存储转写文本
    created_at = Column(DateTime(timezone=False), server_default=func.now())
