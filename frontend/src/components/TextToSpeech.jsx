// src/components/TextToSpeech.jsx
import React, { useState } from 'react';
import axios from 'axios';

function TextToSpeech() {
    const [text, setText] = useState('');
    const [ttsService, setTtsService] = useState('browser'); // 默认使用浏览器API

    const handleTextToSpeech = async () => {
        if (ttsService === 'browser') {
            const utterance = new SpeechSynthesisUtterance(text);
            speechSynthesis.speak(utterance);
        } else if (ttsService === 'server') {
            try {
                // 假设后端API路径是 '/api/text-to-speech'
                const response = await axios.post('http://localhost:8000/api/text-to-speech', { text });
                // 播放返回的音频文件
                const audioUrl = URL.createObjectURL(response.data);
                const audio = new Audio(audioUrl);
                audio.play();
            } catch (error) {
                console.error('Error with server TTS:', error);
            }
        }
        // 处理其他API...
    };

    return (
        <div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} />
            <select value={ttsService} onChange={(e) => setTtsService(e.target.value)}>
                <option value="browser">浏览器 TTS</option>
                <option value="server">服务器 TTS</option>
                {/* 添加其他选项 */}
            </select>
            <button onClick={handleTextToSpeech}>转换为语音</button>
        </div>
    );
}

export default TextToSpeech;
