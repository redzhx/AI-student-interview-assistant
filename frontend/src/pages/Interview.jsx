// frontend/src/pages/Interview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionDisplay from '../components/QuestionDisplay';
import AnswerSection from '../components/AnswerSection-0';
import GenerateSection from '../components/GenerateSection';
import { Container, Row, Col, Button } from 'react-bootstrap'; // 引入 Bootstrap 组件


function Interview({ ttsService }) {
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';


  useEffect(() => {
    fetchInterviewQuestions();
  }, []);

  const fetchInterviewQuestions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/get-interview`);
      if (response.data && response.data.length > 0) {
        setInterviewQuestions(response.data);
        setCurrentQuestionIndex(0);
      } else {
        console.error('No interview questions received');
      }
    } catch (error) {
      console.error('Error fetching interview questions:', error);
    }
  };

  const handleQuestionSwitch = (index) => {
    setCurrentQuestionIndex(index);
    setAnswer(''); // 清空回答
    setEvaluation(''); // 清空评价
  };


  const handleAnswerSubmit = (submittedAnswer) => {
    setAnswer(submittedAnswer);
    // 可以在这里调用生成评价的API
  };


  const currentQuestion = interviewQuestions[currentQuestionIndex];

  return (
    <Container>
      <h1 className="mt-4">模拟面试</h1>
      <p>🪜🚧建设中...</p>

      {currentQuestion && (
        <Row className='text-center'>
          <Col xs={12} md={8}>
            <div className="mt-3">
              {interviewQuestions.map((_, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="mr-2 mb-2"
                  onClick={() => handleQuestionSwitch(index)}
                >
                  问题 {index + 1}
                </Button>
              ))}
            </div>
          </Col>
          <Col xs={12} md={8}>
            <QuestionDisplay question={currentQuestion.question} ttsService={ttsService} />
            <AnswerSection onAnswerSubmit={handleAnswerSubmit} />
            {answer && <GenerateSection question={currentQuestion.question} answer={answer} />}
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Interview;
