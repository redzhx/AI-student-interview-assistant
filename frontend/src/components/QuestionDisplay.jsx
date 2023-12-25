// frontend/src/components/QuestionDisplay.jsx
import React, { useEffect,useRef } from 'react';
import axios from 'axios';
import { useSettings } from './SettingsContext'; 


function QuestionDisplay({ question, ttsService,  }) {
    const audioRef = useRef(null);
    const { isMuted } = useSettings(); // 获取静音模式状态 stopAudio 上面括号里去掉了
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        if (question && !isMuted) {
            playAudio(question);
        }

        // 清理函数，在组件卸载时停止音频播放
        return () => {       
        // 停止通过 HTMLAudioElement 播放的音频
            if (audioRef.current) {
                audioRef.current.pause();
            }
        // 停止通过 SpeechSynthesis 播放的音频
            speechSynthesis.cancel();
        };
    }, [question, isMuted]); // 添加 isMuted 作为依赖

    const playAudio = (text) => {
        if (isMuted) return; // 静音模式，不执行任何操作

        switch (ttsService) {
            
            case 'browser':
                const utterance = new SpeechSynthesisUtterance(text);
                speechSynthesis.speak(utterance);
                break;
            case 'minimax':
                axios.post(`${apiUrl}/api/text-to-speech/minimax`, { text }, { responseType: 'blob' })
                    .then(response => playAudioBlob(response.data))
                    .catch(error => console.error('Error with Minimax TTS:', error));
                break;
            case 'openai':
                axios.post(`${apiUrl}//api/text-to-speec`, { text }, { responseType: 'blob' })
                    .then(response => playAudioBlob(response.data))
                    .catch(error => console.error('Error with OpenAI TTS:', error));
                break;
            
            default:
                console.error('Unknown TTS service:', ttsService);

        }
    };

    const playAudioBlob = (blob) => {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
    };

    return (
        <div>
            {question || "没有问题"}
        </div>
    );
}

export default QuestionDisplay;
