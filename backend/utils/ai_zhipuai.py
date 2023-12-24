# ai_zhpuai.py

import zhipuai
import os

zhipuai.api_key = os.environ.get('API_KEY')


def call_zhipuai(question,user_prompt):
    def stream():
        response = zhipuai.model_api.sse_invoke(
            model="chatglm_pro",
            prompt=[{"role": "user", "content": user_prompt}],
            top_p=0.7,
            temperature=0.9,
        )
        for event in response.events():
            yield event.data

    return stream



