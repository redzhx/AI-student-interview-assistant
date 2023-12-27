// Practice.jsx
import React, { useState } from 'react';
import axios from 'axios';
import QuestionDisplay from '../components/QuestionDisplay';
import AnswerSection from '../components/AnswerSection-0';
import GenerateSection from '../components/GenerateSection';
import { useSettings } from '../components/SettingsContext';
import { Container,Row,Button, Card,Col,Collapse, Spinner } from 'react-bootstrap'; // 确保这一行存在于文件顶部
import PracticeEndModal from '../components/PracticeEndModal';
import ControlPanel from '../components/ControlPanel'; // 确保正确导入 ControlPanel 组件

import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function Practice() {
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [answer, setAnswer] = useState(''); // 用户的回答
  const [evaluation, setEvaluation] = useState('');
  const [isEvaluationGenerated, setIsEvaluationGenerated] = useState(false);
  const [isQuestionGenerated, setIsQuestionGenerated] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [resetKey, setResetKey] = useState(0); // 添加一个用于重置的状态
  const [showEndModal, setShowEndModal] = useState(false);
  const { aiChoice } = useSettings();
  const [hint, setHint] = useState('');
  const [open, setOpen] = useState(false);  // 控制折叠面板的开关
  const [loadingHint, setLoadingHint] = useState(false);
  const { ttsService } = useSettings(); // 从 SettingsContext 获取 TTS 配置
  const [showControlPanel, setShowControlPanel] = useState(false);


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
      // setAudioUrl(''); // 清空录音 URL
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

//处理提交的答案
  const handleAnswerSubmit = (submittedAnswer) => {
    setAnswer(submittedAnswer);
};

//处理生成的评价
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
          <h1>练习模式
          <Button
          id="contolbtn" 
          className="ml-3  shaking-btn outline-primary"
          onClick={() => setShowControlPanel(true)}
        >
        <i class="fa-solid fa-robot"></i>      
      </Button></h1>
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
                                <p> 请稍等...提示马上来到...你也可以先想想怎么回答哦...</p>
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
                   <AnswerSection 
                    onAnswerSubmit={handleAnswerSubmit} 
                    key={resetKey} // 使用 key 来重置组件状态
                    disabled={isEvaluationGenerated}/> 
                {/* </Card.Body>
              </Card> */}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <GenerateSection 
                currentQuestion={currentQuestion}
                answer={answer} 
                onEvaluationGenerated={handleEvaluationGenerated} 
                aiChoice={aiChoice} 
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
      
      
      <ControlPanel show={showControlPanel} onHide={() => setShowControlPanel(false)} />
  
    </Container>

  );
}

export default Practice;
