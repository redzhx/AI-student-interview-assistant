// AudioRecorder.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // 导入 Bootstrap 样式
import { Button,Spinner } from 'react-bootstrap';
import '../App.css';


function AudioRecorder({ onTranscriptReady }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [countdown, setCountdown] = useState(20);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const countdownTimerRef = useRef(null);

    useEffect(() => {
        if (countdown === 0 && isRecording) {
            stopRecording();
        }
    }, [countdown, isRecording]);

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
            setCountdown(20); // 重置倒计时
            countdownTimerRef.current = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        } catch (error) {
            setError('Error accessing media devices');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(countdownTimerRef.current);
        }
    };

    const uploadAudio = async (audioBlob) => {
        setLoading(true); // 开始上传时显示 Spinner
        const formData = new FormData();
        formData.append("audioFile", audioBlob, "audio.mp3");

        try {
            const response = await axios.post('http://localhost:8000/api/upload-audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setTranscript(response.data.transcript);
            onTranscriptReady(response.data.transcript);
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
        setLoading(false); // 上传结束或发生错误时隐藏 Spinner

    };

    return (
        
        <div>                    
                <div className="my-3">
                    <strong className="text-primary"> <i class="fa-solid fa-hourglass-start"></i>  限时回答 : {countdown} 秒</strong>
                </div>
                 <div>
                    {transcript && <p> 💁‍♂️ : {transcript}</p>}
                     {error && <p>Error: {error}</p>}
                     {loading && <Spinner animation="border" variant="primary" role="status">
                        <span className="sr-only">Loading...</span>
                        </Spinner>}<br/>
                     {audioUrl && <audio src={audioUrl} controls />}
                    
                 </div>
                
                    {isRecording ? (
                    <Button className="btn-danger my-1" onClick={stopRecording} disabled={countdown === 0}><i class="fa-regular fa-circle-stop fa-lg"></i></Button>
                    ) : (
                    <Button className="btn-danger my-1" onClick={startRecording}><i class="fa-solid fa-microphone fa-lg"></i></Button>
                    )}
                
        </div>
    );
}

export default AudioRecorder;
