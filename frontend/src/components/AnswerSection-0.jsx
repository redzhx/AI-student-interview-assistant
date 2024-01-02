// AnswerSection-0.jsx
import React, { useState, useRef, useEffect,useCallback } from 'react';
import TextInput from './TextInput';
import axios from 'axios';
import { Button,Spinner,Card,Row,Col,Badge} from 'react-bootstrap';
import '../App.css';

function AnswerSection({ onAnswerSubmit,disabled}) {

    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null); // 定义 audioUrl 状态
    const [transcript, setTranscript] = useState(''); // 定义 transcript 状态
    const [countdown, setCountdown] = useState(120);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isRecordingMode, setIsRecordingMode] = useState(true); // 默认为录音模式
    const countdownTimerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';


    const toggleAnswerMode = () => {
        setIsRecordingMode(!isRecordingMode);
        setAudioUrl(null);
        setTranscript('');
        setError(null);
        setCountdown(120); // 重置倒计时

    };

    useEffect(() => {
        return () => {
            clearInterval(countdownTimerRef.current);
        };
    }, []);

    const startRecording = async () => {
        // 清除旧的录音文件和转写文本
        setAudioUrl(null);
        setTranscript('');
        setError(null);

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
            setIsRecordingMode(true);

            setCountdown(120); // 重置倒计时
            countdownTimerRef.current = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);

        
        } catch (error) {
            setError('Error accessing media devices');
        }
    };

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(countdownTimerRef.current);
        }
    }, [mediaRecorderRef, isRecording, setIsRecording, countdownTimerRef]);

    const uploadAudio = async (audioBlob) => {
        setLoading(true); // 开始上传时显示 Spinner
        const formData = new FormData();
        formData.append("audioFile", audioBlob, "audio.mp3");

        try {
            const response = await axios.post(`${apiUrl}/api/upload-audio`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setTranscript(response.data.transcript);
            // onTranscriptReady(response.data.transcript);
            onAnswerSubmit(response.data.transcript); // 更新答案状态

        } catch (error) {
            console.error('Error uploading audio:', error);
        }
        setLoading(false); // 上传结束或发生错误时隐藏 Spinner

    };

    // 格式化时间
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (countdown === 0 && isRecording) {
            stopRecording();
        } else if (isRecording) {
            countdownTimerRef.current = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        }

        return () => {
            clearInterval(countdownTimerRef.current);
        };
    }, [countdown, isRecording, stopRecording]);

    return (
        <>
        <div  className="mb-4 py-3">
        {isRecordingMode&&(
           <div className="my-2 " >
                <div><h5 className="text-light"> {formatTime(countdown)}</h5></div>

                {error && <p>Error: {error}</p>}
                <div>{audioUrl && <audio src={audioUrl} controls />}</div>
                {loading && (
                    <div>
                    <Spinner animation="border" variant="light" role="status">
                    <span className="sr-only">Loading...</span>
                    </Spinner></div>
                )}
                <div>{transcript && <p>  {transcript}</p>}</div>

                           

        </div>)}
        
            <div md="12">
            {!isRecordingMode && <TextInput onTextSubmit={onAnswerSubmit} disabled={isRecording} />}
            </div>
            <div className=" align-items-center">
                <div>
                    <Button variant="white"  className=" btn-icon-only mr-4" size="" onClick={toggleAnswerMode} disabled={disabled}>
                        <i className={isRecordingMode ? 'fa-solid fa-keyboard' : 'fa-solid fa-xmark'}> <Badge bg="" className="text-light"></Badge> </i>
                        {isRecordingMode ? ' ' : ' '}
                    </Button>
                    <Button variant="danger" 
                    className=" btn-icon-only record-btn shadow my-1"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isRecording && countdown === 0}
                    >
                    <i className={`fa-${isRecording ? 'regular fa-circle-stop' : 'solid fa-microphone'} fa-lg`}></i>
                    </Button>
                        
                </div>   
            </div>
        </div>

        
    </>
      );
}
export default AnswerSection;
