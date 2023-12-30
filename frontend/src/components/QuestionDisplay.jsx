// frontend/src/components/QuestionDisplay.jsx
import React, { useEffect,useRef,useCallback } from 'react';
import axios from 'axios';
import { useSettings } from './SettingsContext'; 

function QuestionDisplay({ question}) {
    const audioRef = useRef(null);
    const { isMuted, ttsService } = useSettings();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const playAudio = useCallback((text) => {
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
                axios.post(`${apiUrl}/api/text-to-speech`, { text }, { responseType: 'blob' })
                    .then(response => playAudioBlob(response.data))
                    .catch(error => console.error('Error with OpenAI TTS:', error));
                break;
            default:
                console.error('Unknown TTS service:', ttsService);
        }
    }, [apiUrl,isMuted, ttsService]);

    const playAudioBlob = (blob) => {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
    };


    useEffect(() => {
        if (question) {
            playAudio(question);
        }

        // 复制 audioRef.current 到一个局部变量
        const currentAudioRef = audioRef.current;

        return () => {
            if (currentAudioRef) {
                currentAudioRef.pause();
            }
            speechSynthesis.cancel();
        };
    }, [question, playAudio]);


    return (
        <>
            {question || "没有问题"}
        </>
    );
}

export default QuestionDisplay;
