# backend/main.py
from fastapi import FastAPI, Request, Depends, HTTPException, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse,StreamingResponse,FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from server import crud, models, schemas
from server.database import SessionLocal, engine
from utils.question_manager import get_random_question, get_random_questions
from utils.ai_minimax import text_to_speech as minimax_tts
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from pathlib import Path
from utils.ai_zhipuai import call_zhipuai
from utils.ai_openai import OpenAIServices
import shutil
import os
import uvicorn



app = FastAPI()
openai_services = OpenAIServices()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


#Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

load_dotenv()

# 设置数据格式
class Item(BaseModel):
    prompt: str | None = ''
    question: str | None = ''  # 添加 question 字段
    user_response: str | None = ''  # 新增字段
    ai: str | None = 'zhipuai'  # 添加 ai 字段
    
class TextToSpeechRequest(BaseModel):
    text: str


models.Base.metadata.create_all(bind=engine)

# CORS 配置

# CORS配置
# 允许的源列表
origins = [
    FRONTEND_URL,
    "http://localhost:3000",  # React应用运行地址
    "http://127.0.0.1:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 使用 origins 列表
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头部
)

# 设置静态文件目录
app.mount("/static", StaticFiles(directory="../frontend/build"), name="static")

# FastAPI 根目录路由


@app.get("/")
async def root():
    return FileResponse('frontend/build/index.html')



# 答题页面路由 react

@app.get("/api/get-question")
async def get_question():
    question = get_random_question()
    if question is None:
        raise HTTPException(status_code=404, detail="No questions available")
    return question


@app.get("/api/get-interview")
async def get_interview():
    questions = get_random_questions(3)
    if questions is None:
        raise HTTPException(status_code=404, detail="Not enough questions available")
    return questions

@app.get("/api/history", response_class=JSONResponse)
async def get_history(request: Request, db: Session = Depends(get_db)):
    records = crud.get_records(db)
    return records
    # request: Request, return templates.TemplateResponse("history.html", {"request": request, "records": records})



@app.post('/api/generate')
async def generate(item: Item):
    # 设置 generate 的 user_prompt
    user_prompt = f"你是培训中学生练习中考自招考试面试环节的教练。你正在辅导学生模拟面试。学生抽到的问题是:{item.question},学生的回答是:{item.user_response}，请对学生进行评价并指导怎样改进。回复内容包括四部分:1.评分(满分10分制)、2.评价学生的回答、3.教学生怎样更好回答这个问题 4.给学生一份参考回答。5. 随机告诉学生一条中考升学面试小技巧。 语言表达友善公正。"

    if item.ai == 'zhipuai':
        stream = call_zhipuai(item.question, user_prompt)
    elif item.ai == 'openai':
        stream = openai_services.call_openai(item.question, user_prompt)
    else:
        raise HTTPException(status_code=400, detail="Invalid AI option")

    return StreamingResponse(stream())

# 添加一个新的路由来处理取消生成请求
@app.post('/api/cancel-generate')
async def cancel_generate_request():
    global cancel_generate
    cancel_generate = True  # 设置取消生成标志为 True
    return {"message": "Cancel generate request received"}


@app.post('/api/generate-hint')
async def generate_hint(item: Item):
    # 设置 generate-hint 的 user_prompt
    user_prompt = f"你是辅导学生参加中学升学面试的老师，针对怎样回答面试问题 '{item.question}'，学生不知道怎么入手，请给一些回答的提示, 让学生能够顺着你的提示完成回答。"

    if item.ai == 'zhipuai':
        stream = call_zhipuai(item.question, user_prompt)
    elif item.ai == 'openai':
        stream = openai_services.call_openai(item.question, user_prompt)
    else:
        raise HTTPException(status_code=400, detail="Invalid AI option")

    return StreamingResponse(stream())

# 创建新的数据 ok
@app.post("/api/create", response_model=schemas.Record)
def create_record(
    record: schemas.RecordCreate, db:Session = Depends(get_db)
):
    db_record  = crud.create_record(db=db, record=record)
    return db_record

# 文字转语音 ok
@app.post("/api/text-to-speech")
async def tts_endpoint(request_data: TextToSpeechRequest):
    text = request_data.text
    file_path = Path("assets/speech.mp3")
    try:
        # 调用 ai_tts 模块的功能
        audio_file_path = openai_services.text_to_speech(text, file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # 返回音频文件
    return FileResponse(path=audio_file_path, media_type="audio/mpeg", filename=file_path.name)




# minimax
@app.post("/api/text-to-speech/minimax")
async def tts_minimax_endpoint(request_data: TextToSpeechRequest):
    text = request_data.text
    file_path = Path("assets/speech_minimax.mp3")
    try:
        minimax_tts(text, file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return FileResponse(path=file_path, media_type="audio/mpeg", filename=file_path.name)

# 语音转文字
@app.post("/api/upload-audio")
async def upload_audio(audioFile: UploadFile = File(...)):
    try:
        # 保存文件到服务器的临时位置
        audio_path = f"uploads/{audioFile.filename}"
        with open(audio_path, "wb") as f:
            shutil.copyfileobj(audioFile.file, f)

        # 调用 OpenAI 的语音转文字服务
        transcript = openai_services.speech_to_text(audio_path)
        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 频转写文本的保存

@app.post("/api/create-transcription", response_model=schemas.Transcription)
def create_transcription_endpoint(transcription: schemas.TranscriptionCreate, db: Session = Depends(get_db)):
    return crud.create_transcription(db=db, transcription=transcription)


# 删除数据
@app.delete("/api/delete/{id}", response_model=schemas.DeleteStatus)
async def delete_record(
    id:int,db:Session = Depends(get_db)
    ):
    result  = crud.delete_record(db=db, id=id)
    return result


# /search/ 路由 
@app.get("/search/", response_class=JSONResponse)
async def search(request: Request, anwser: str, db: Session = Depends(get_db)):
    records = crud.search_records(db, anwser)
    # 返回 JSON 数据而不是 HTML
    return {"records": records}


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000,  reload=True, log_level="info") 
