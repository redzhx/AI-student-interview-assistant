# ai_openai.py
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

class OpenAIServices:
    def __init__(self):
        self.client = OpenAI(api_key=api_key)

    def call_openai(self, user_prompt):
        stream = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", 
                 "content": user_prompt}
            ],
            stream=True,
        )

        def generate_response():
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        return generate_response

    def text_to_speech(self, text, file_path):
        response = self.client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=text
        )

        response.stream_to_file(file_path)
        return file_path

    # speech_to_text 
    def speech_to_text(self, audio_path):
        try:
            with open(audio_path, "rb") as audio_file: 
            # audio_file= open("speech.mp3", "rb")
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1", 
                    file=audio_file,
                    response_format="text"
                )
            return transcript
        except Exception as e:
            raise Exception(f"Speech to text conversion failed: {str(e)}")

        print(transcript)
        # OpenAI 的语音到文本转换逻辑




# 使用方法
# openai_services = OpenAIServices()
# text = openai_services.call_openai(question, user_response)
# file_path = openai_services.text_to_speech("你好，世界！", "hello_world.mp3")
# openai_services.speech_to_text("path_to_audio_file.mp3")
