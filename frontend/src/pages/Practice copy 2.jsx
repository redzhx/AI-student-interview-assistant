// Practice.jsx
import React, { useState } from 'react';
import axios from 'axios';
import QuestionDisplay from '../components/QuestionDisplay';
// import AnswerSection from '../components/AnswerSection';
import AnswerSection from '../components/AnswerSection-0';
import GenerateSection from '../components/GenerateSection';
import { useSettings } from '../components/SettingsContext';
import { Container,Row,Button, Card,Col,Collapse, Spinner } from 'react-bootstrap'; // 确保这一行存在于文件顶部
import PracticeEndModal from '../components/PracticeEndModal';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../App.css';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';


function Practice() {
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [answer, setAnswer] = useState(''); // 用户的回答
  const [evaluation, setEvaluation] = useState('');
  const { ttsService, sttService, evaluationService } = useSettings();
  // const [audioUrl, setAudioUrl] = useState(''); // 新增状态以存储音频 URL
  const [isEvaluationGenerated, setIsEvaluationGenerated] = useState(false);
  const [isQuestionGenerated, setIsQuestionGenerated] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const [resetKey, setResetKey] = useState(0); // 添加一个用于重置的状态
  const [showEndModal, setShowEndModal] = useState(false);
  const [aiChoice, setAiChoice] = useState('zhipuai');
  const [hint, setHint] = useState('');
  const [open, setOpen] = useState(false);  // 控制折叠面板的开关
  const [loadingHint, setLoadingHint] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    // 获取问题的函数
    const fetchAndPlayQuestion = async () => {
      try {
          const response = await axios.get(`${apiUrl}/api/get-question`);
          if (response.data) {
              setCurrentQuestion(response.data);
          } else {
              console.error('No question received');
          }
      } catch (error) {
          console.error('Error fetching question:', error);
      }
      setIsEvaluationGenerated(false); // 重置生成评价状态
      setAnswer(''); // 清空答案
      setAudioUrl(''); // 清空录音 URL
      setEvaluation(''); // 清空评价
      setIsQuestionGenerated(true);
      setResetKey(prev => prev + 1); // 更新重置键
      setOpen(false);  // 关闭折叠面板
      setHint('');  // 清空提示

  };


// 定义处理获取提示的函数
const handleHintRequest = async () => {
  if (!loadingHint && !hint) {

  setLoadingHint(true);

      try {
          const response = await axios.post(`${apiUrl}/api/generate-hint`, { 
              question: currentQuestion.question,
              ai: aiChoice
          });

          setHint(response.data); // 假设响应数据就是您想要显示的提示
      } catch (error) {
          console.error('Error fetching hint:', error);
        } finally {
          setLoadingHint(false);
          setOpen(true); // 加载完成后自动展开提示区域
        } 
      } else {
          // 如果已有提示内容，则切换提示区域的折叠状态
          setOpen(!open);
  }
};

  const handleAnswerSubmit = (submittedAnswer) => {
    setAnswer(submittedAnswer);
    // 其他处理逻辑（如果有的话）
};

  const handleEvaluationGenerated = (generatedEvaluation) => {
    setEvaluation(generatedEvaluation);
    setIsEvaluationGenerated(true); // 设置生成评价后的状态
    setQuestionCount(questionCount + 1); // 递增答题计数器
  };

//   const handleReset = () => {
//     fetchAndPlayQuestion(); // 使用新的问题获取函数
// };

const endPractice = () => {
  setShowEndModal(true);
};

  return (
    <Container container-lg className="col-md-8 py-4">
        <div md={12} className="text-center my-4">
          <h1>练习模式</h1>
          <p>🚧页面样式优化中</p>
        </div>
        <div className="justify-content-center mb-3">
          <div md={6} className="text-center">
            <Button variant="outline-primary" onClick={fetchAndPlayQuestion} className="mr-2">
              {isQuestionGenerated ? '下一题' : '开始答题'}
            </Button>
            {isQuestionGenerated && (
              <Button variant="outline-secondary" onClick={endPractice}>
                结束练习
              </Button>
            )}
          </div>
        </div>  
          
      {currentQuestion.question && (
        <>
          <Row className='my-3'>
                    <Col md={12} className="mb-3">
                        <h5 className="bold"><QuestionDisplay question={currentQuestion.question} ttsService={ttsService} /></h5>
                        <Button variant="outline-primary" className="my-2" size="sm" 
                            onClick={handleHintRequest}
                            disabled={loadingHint}
                        >
                            {loadingHint ? '生成中...' : (open ? '收起提示' : '给点提示')}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {loadingHint ? 
                            <div className="text-center">
                                <Spinner animation="border" role="status" className="my-2">
                                    <span className="sr-only">生成提示中...</span>
                                </Spinner>
                                <p> 让我仔细先想一想...请稍后...马上会给你一个很棒的提示...你也可以先想想怎么回答哦...</p>
                            </div>
                            : 
                            <Collapse in={open}>
                                <Card.Body style={{whiteSpace: 'pre-line', textAlign: 'left'}}>
                                    {`💡提示: ${hint}`}
                                </Card.Body>
                            </Collapse>
                        }
                    </Col>
                </Row>
          <Row>
            <Col md={12} className="mb-3">
              {/* <Card>
                <Card.Body> */}
                  <AnswerSection onAnswerSubmit={handleAnswerSubmit} key={resetKey} setAudioUrl={setAudioUrl} disabled={isEvaluationGenerated} />
                {/* </Card.Body>
              </Card> */}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <GenerateSection 
                question={currentQuestion.question} 
                answer={answer} 
                onEvaluationGenerated={handleEvaluationGenerated} 
                evaluationService={evaluationService} 
                disabled={!answer || isEvaluationGenerated}
              />
            </Col>
          </Row>
        </>
      )}
      {evaluation && (
        <Row>
          <Col md={12} className="mt-3">
            <Card>
              <Card.Header>
                <strong>{currentQuestion.question}</strong> 
              </Card.Header>
              <Card.Body>
                <Card.Subtitle className="mb-2">你的回答: {answer}</Card.Subtitle>
                <Card.Text style={{   whiteSpace: 'pre-line',textAlign: 'left' }}>
                  <strong>评价：</strong>{evaluation}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}          

      <PracticeEndModal 
        show={showEndModal} 
        onHide={() => setShowEndModal(false)} 
        questionCount={questionCount}
      />
    </Container>

  );
}

export default Practice;
