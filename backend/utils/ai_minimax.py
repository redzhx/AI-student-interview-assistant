# ai_minimax.py
import requests
import os

api_key = os.environ.get('MINIMAX_API_KEY')


def text_to_speech(text, file_path):
    group_id = "1729339214534808215"
    api_key = os.environ.get('MINIMAX_API_KEY') 

    url = f"https://api.minimax.chat/v1/text_to_speech?GroupId={group_id}"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    data = {
        "voice_id": "male-qn-jingying",
        "text": text,  # 使用传入的文本
        "model": "speech-01",
        "speed": 1.1,
        "vol": 1.0,
        "pitch": 0,
        "timber_weights": [
            {
                "voice_id": "female-shaonv",
                "weight": 1
            },
        ]
    }
    response = requests.post(url, headers=headers, json=data)
    print("trace_id", response.headers.get("Trace-Id"))
    if response.status_code != 200 or "json" in response.headers["Content-Type"]:
        print("调用失败", response.status_code, response.text)
        return  # 如果调用失败，直接返回，不再保存音频文件

    with open(file_path, "wb") as f:
        f.write(response.content)