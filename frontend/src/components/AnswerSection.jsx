// AnswerSection.jsx  有bug 文本答题模式下，如果有语音回答， 会提交语音而不是文本
import React, { useState, useRef, useEffect } from 'react';
import { Button,Spinner } from 'react-bootstrap';
import axios from 'axios';
import '../App.css';

function AnswerSection({ onAnswerSubmit, disabled }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isRecordingMode, setIsRecordingMode] = useState(true); // 默认进入录音模式

    const [inputText, setInputText] = useState('');
    const [audioUrl,setAudioUrl ] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [countdown, setCountdown] = useState(20);
    const [error, setError] = useState(null);
    const mediaRecorderRef = useRef(null);
    const countdownTimerRef = useRef(null);
    const [activeSubmissionMode, setActiveSubmissionMode] = useState('audio'); // 新增状态跟踪提交模式

    // 切换答题模式
    const toggleAnswerMode = () => {
        setIsRecordingMode(!isRecordingMode);
        setActiveSubmissionMode(isRecordingMode ? 'text' : 'audio'); // 切换提交模式

    };
    // 开始录音
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorderRef.current.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                if (!audioChunks.length) {
                    setError('No audio data available.');
                    return;
                }
                const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
                setAudioUrl(URL.createObjectURL(audioBlob));
                uploadAudio(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setCountdown(20);
            countdownTimerRef.current = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        } catch (error) {
            setError('Error accessing media devices');
        }
    };

    // 停止录音
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(countdownTimerRef.current);
        }
    };
    // 倒计时结束停止录音
    useEffect(() => {
        if (countdown === 0 && isRecording) {
            stopRecording();
        }
    }, [countdown, isRecording]);

    // 清除倒计时
    useEffect(() => {
        return () => {
            clearInterval(countdownTimerRef.current);
        };
    }, []);

    // 上传音频并获取转写
    const uploadAudio = async (audioBlob) => {
        const formData = new FormData();
        formData.append("audioFile", audioBlob, "audio.mp3");

        try {
            const response = await axios.post('http://localhost:8000/api/upload-audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setTranscript(response.data.transcript);
            setAudioUrl(URL.createObjectURL(audioBlob)); // 设置录音文件的 URL
            onAnswerSubmit(response.data.transcript);
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
    };

    // 当录音完成时，处理转录文本并提交答案
    useEffect(() => {
        if (transcript) {
            onAnswerSubmit(transcript);
        }
    }, [transcript, onAnswerSubmit]);
    
    // 文本输入区域的更改处理
    const handleTextInputChange = (e) => {
        setInputText(e.target.value);
        // 只有在文本模式下才更新父组件的 answer 状态
        if (!isRecordingMode) {
            onAnswerSubmit(e.target.value);
        }
    };

// // 提交答案
// const handleSubmitAnswer = () => {
//     if (activeSubmissionMode === 'text') {
//         if (inputText.trim() === '') {
//             alert("请输入文本内容后再提交！");
//             return;
//         }
//         onAnswerSubmit(inputText);
//     }
// };

    // const handleAudioTranscriptReady = (transcript, audioUrl) => {
    //     //   setIsRecording(false); // 停止录音
    //       setTranscript(transcript); // 设置转写文本
    //       setAudioUrl(audioUrl); // 设置录音文件的 URL
    //       onAnswerSubmit(transcript); // 提交答案进行评价
    //   };

    return (
        <div className="container mt-4">
            
            {isRecordingMode ? (
                // 在录音模式下，根据是否正在录音显示不同的按钮
                <div>
                    
                     <div className="my-3">
                        <strong className="">语音限时 : {countdown} 秒</strong>
                    </div>
                    <div>
                    {transcript && <p>{transcript}</p>}
                    {error && <p className="text-danger">Error: {error}</p>}
                    {audioUrl && <audio src={audioUrl} controls />}
                    </div>
                    
                    <Button className={`btn-${isRecording ? 'dark' : 'danger'} my-1`} onClick={isRecording ? stopRecording : startRecording}>
                        <i className={`fa-${isRecording ? 'regular fa-circle-stop' : 'solid fa-microphone'} fa-lg`}></i> {isRecording ? '停止' : '开始'}
                    </Button>
                   
                </div>
            ) : (
                // 在文本模式下，显示文本输入区域
                <div className="textarea-container my-3">
                    <textarea
                        value={inputText}
                        onChange={handleTextInputChange}
                        className="form-control"
                        rows="4"
                        placeholder="输入回答..."
                    />
                </div>
            )}
            <Button variant="primary" onClick={toggleAnswerMode} disabled={disabled}>
                <i className={isRecordingMode ? "fa-solid fa-keyboard" : "fa-solid fa-microphone"}></i>
                {isRecordingMode ? ' 键盘' : '  返回'}
            </Button>
            
        </div>
       
    );
}

export default AnswerSection;
