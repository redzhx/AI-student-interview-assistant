# crud.py
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from sqlalchemy import desc
from sqlalchemy import or_
from datetime import datetime
from . import models, schemas
import json
import random


# 操作数据库：添加 crud.py
def create_record(db: Session, record: schemas.RecordCreate):
    now = datetime.now().replace(microsecond=0)
    db_record = models.Record(
        question=record.question,
        answer=record.answer, 
        content=record.content,
        created_at=now,
        # timestamp=datetime.utcnow()  # 根据需要设置时间戳
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# 操作数据库：获取所有记录
def get_records(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Record).offset(skip).limit(limit).all()

# 操作数据库：删除记录
def delete_record(db: Session, id: int):
    record = db.get(models.Record, id)
    db.delete(record)
    db.commit()
    return { "ok": True, "deleted_id":id }


# 查询功能
# def search_records(db: Session, answer: str):
#     return db.query(models.Record).filter(models.Record.answer.ilike(f"%{answer}%")).order_by(desc(models.Record.updated_at)).all()

# def format_datetime(dt):
#     return dt.strftime('%Y-%m-%d %H:%M:%S')

# 搜索功能 SQL Alchemy 的 ilike 方法，对大小写不敏感
def get_records_by_search(db: Session, search: str):
    search = f"%{search}%"
    return db.query(models.Record).filter(
        or_(
            models.Record.question.ilike(search),
            models.Record.answer.ilike(search),
            # models.Record.content.ilike(search)
        )
    ).all()

# 创建音频转写记录
def create_transcription(db: Session, transcription: schemas.TranscriptionCreate):
    db_transcription = models.Transcription(text=transcription.text)
    db.add(db_transcription)
    db.commit()
    db.refresh(db_transcription)
    return db_transcription

# 获取所有音频转写记录
def get_transcriptions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Transcription).offset(skip).limit(limit).all()



# 更多session API
# 参考：https://docs.sqlalchemy.org/en/20/orm/session_api.html#sqlalchemy.orm.Session