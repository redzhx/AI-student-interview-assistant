// AnswerSection-0.jsx
import React, { useState, useRef, useEffect } from 'react';
import TextInput from './TextInput';
import axios from 'axios';
import { Button, Spinner } from 'react-bootstrap';
import '../App.css';

function AnswerSection({ onAnswerSubmit,disabled, }) {

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null); // 定义 audioUrl 状态
  const [transcript, setTranscript] = useState(''); // 定义 transcript 状态

  const [countdown, setCountdown] = useState(20);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecordingMode, setIsRecordingMode] = useState(true); // 默认为录音模式
  const countdownTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

//     const handleAudioTranscriptReady = (transcript, audioUrl) => {
//     //   setIsRecording(false); // 停止录音
//       setTranscript(transcript); // 设置转写文本
//       setAudioUrl(audioUrl); // 设置录音文件的 URL
//       onAnswerSubmit(transcript); // 提交答案进行评价
//   };

    // const toggleAnswerMode = () => {
    //     setIsRecording(!isRecording);
    // };

    const toggleAnswerMode = () => {
      setIsRecordingMode(!isRecordingMode);
      // 清除文本或语音的状态
      setAudioUrl(null);
      setTranscript('');
      setError(null);
  };

    useEffect(() => {
      if (countdown === 0 && isRecording) {
          stopRecording();
      }
  }, [countdown, isRecording,]);

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



    return (
        <div id="answerarea" className="container mt-4">
            {isRecordingMode ? (
                <div>
                    <div className="my-3">
                        <strong className="text-primary">
                            <i className="fa-solid fa-hourglass-start"></i> 语音限时 : {countdown} 秒
                        </strong>
                    </div>
                    <div>
                        {transcript && <p>💁‍♂️: {transcript}</p>}
                        {error && <p>Error: {error}</p>}
                        {loading && <Spinner animation="border" variant="primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>}<br/>
                        {audioUrl && <audio src={audioUrl} controls />}
                    </div>
                    <Button 
                        className="btn-danger my-1" 
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isRecording && countdown === 0}
                    >
                        <i className={`fa-${isRecording ? 'regular fa-circle-stop' : 'solid fa-microphone'} fa-lg`}></i>
                    </Button>
                </div>
            ) : (
                <TextInput onTextSubmit={onAnswerSubmit} />
            )}
            <Button variant="primary" onClick={toggleAnswerMode} disabled={disabled}>
                <i className={isRecordingMode ? "fa-solid fa-keyboard" : "fa-solid fa-xmark"}></i>
                {isRecordingMode ? ' ' : ' '}
            </Button>
        </div>
    );
}
export default AnswerSection;
