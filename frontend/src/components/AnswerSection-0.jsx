// AnswerSection-0.jsx
import React, { useState, useRef, useEffect,useCallback } from 'react';
import TextInput from './TextInput';
import axios from 'axios';
import { Button,Spinner,Card,Row,Col} from 'react-bootstrap';
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

    useEffect(() => {
        if (countdown === 0 && isRecording) {
            stopRecording();
        }
    }, [countdown, isRecording, stopRecording]);


    return (
        <div >
           {isRecordingMode&&(<Card className="my-1">
            {/* <Card.Header className="mb-2">回答</Card.Header> */}
            <Card.Body id="answerarea" >
               
                <Card.Text style={{ whiteSpace: 'pre-line', textAlign: '' }}>
                <strong className="text-light">限时: {countdown} 秒</strong><br/>
                    {loading && (
                    <Spinner animation="border" variant="primary" role="status">
                    <span className="sr-only">Loading...</span>
                    </Spinner>
                )}
                {transcript && <p>{transcript}</p>}
                {error && <p>Error: {error}</p>}
                <br/>
                {audioUrl && <audio src={audioUrl} controls />}
                </Card.Text>
            </Card.Body>
        </Card>)}
            {/* {!isRecordingMode && (<TextInput onTextSubmit={onAnswerSubmit} disabled={isRecording} />)}
            <Card id="answerarea">
            <Card.Body className="text-center">
            <Button variant="outline-primary" onClick={toggleAnswerMode} disabled={disabled}>
                <i className={isRecordingMode ? 'fa-solid fa-keyboard' : 'fa-solid fa-xmark'}></i>
                {isRecordingMode ? ' ' : ' '}
            </Button>
            <Button
            className="btn-danger my-1"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isRecording && countdown === 0}
            >
            <i className={`fa-${isRecording ? 'regular fa-circle-stop' : 'solid fa-microphone'} fa-lg`}></i>
            </Button>
            
            </Card.Body>
          </Card> */}
        <Row>
            <Col>
            {!isRecordingMode && (<TextInput onTextSubmit={onAnswerSubmit} disabled={isRecording} />)}
            <Button variant="outline-primary" onClick={toggleAnswerMode} disabled={disabled}>
                <i className={isRecordingMode ? 'fa-solid fa-keyboard' : 'fa-solid fa-xmark'}></i>
                {isRecordingMode ? ' ' : ' '}
            </Button>
            <Button
            className="btn-danger my-1"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isRecording && countdown === 0}
            >
            <i className={`fa-${isRecording ? 'regular fa-circle-stop' : 'solid fa-microphone'} fa-lg`}></i>
            </Button>
            </Col>
        </Row>
        </div>
      );
}
export default AnswerSection;
