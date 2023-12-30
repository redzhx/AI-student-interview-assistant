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
              setIsEvaluationGenerated(false); // 重置生成评价状态
              setAnswer(''); // 清空答案
              // setAudioUrl(''); // 清空录音 URL
              setEvaluation(''); // 清空评价
              setIsQuestionGenerated(true);
              setResetKey(prev => prev + 1); // 更新重置键
              setOpen(false);  // 关闭折叠面板
              await generateHint(response.data.question); // 假设问题数据中包含问题文本

          } else {
              console.error('No question received');
          }
      } catch (error) {
          console.error('Error fetching question:', error);
      }
      

  };

// 定义生成提示的函数
const generateHint = async (question) => {
  setLoadingHint(true);
  setHint(''); // 清空先前的提示
  try {
    const response = await fetch(`${apiUrl}/api/generate-hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: question, ai: aiChoice })
    });

    const reader = response.body.getReader();
    let hintStream = '';

    // 处理流数据
    reader.read().then(function processStream({ done, value }) {
      if (done) {
        setLoadingHint(false);
        setOpen(true); // 当读取完成时展开提示区域
        return;
      }

      // 将 Uint8Array 转换为字符串
      const chunk = new TextDecoder("utf-8").decode(value);
      hintStream += chunk;
      setHint(hintStream); // 更新提示

      // 读取下一块数据
      return reader.read().then(processStream);
    });

  } catch (error) {
    console.error('Error fetching hint:', error);
    setLoadingHint(false);
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


const endPractice = () => {
  setShowEndModal(true);
};

return (
  <Container container-lg className="col-md-8 py-4">
      <div md={12} className="text-left my-4">
        <h3>  
        <Button
                id="controlbtn" 
                className="ml-3  shaking-btn outline-primary"
                onClick={() => setShowControlPanel(true)}
              >
              <i class="fa-solid fa-robot"></i>     
              </Button> 
       </h3>
      </div>
      <Row className="mb-3 d-flex justify-content-center">
      {!isQuestionGenerated && (
        <Col md={6} className="text-center">
          <br/>
          <br/>
          <Button variant="outline-primary" size="lg" onClick={fetchAndPlayQuestion} className="mr-2">
            开始答题
          </Button>
        </Col>
        )}
      </Row>
    {currentQuestion.question && (
      <>
        <Row className='my-3 '>
            <Col md={12} className="mb-3">
                <h5 className="displlay-3"style={{FontWeight:'bold'}}>
               
                <QuestionDisplay question={currentQuestion.question} ttsService={ttsService} />
                <Button variant="outline-success" id="round-btn" className="btn-icon-only "
                  onClick={() => setOpen(!open)} 
                  aria-controls="hint-collapse" 
                  aria-expanded={open}
                >
                  💡
                </Button> </h5>
            </Col>
        </Row>
        <Row>
          <Col md={12}>
            {/* 按钮用于控制折叠卡的展开和折叠 */}
            {/* 折叠卡内容 */}
            <Collapse in={open}>
              <div id="hint-collapse">
                <Card >
                  <Card.Body>
                <Card.Text style={{whiteSpace: 'pre-line', textAlign: 'left'}}>
                   
                    {hint}
                  </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Collapse>
          </Col>
        </Row>      
        {!isEvaluationGenerated && (
        <Row>
          <Col md={12} className="mb-3">
            {/* <Card>
              <Card.Body> */}
                 <AnswerSection 
                  onAnswerSubmit={handleAnswerSubmit} 
                  key={resetKey} // 使用 key 来重置组件状态
                  // disabled={isEvaluationGenerated}
                  /> 
              {/* </Card.Body>
            </Card> */}
          </Col>
        </Row>
        )}
      </>
    )}
    {isQuestionGenerated && (
      <Row>
        <Col md={12} className="mt-3">
          <Card>
          <Card.Header className="text-center">
            <GenerateSection 
              currentQuestion={currentQuestion}
              answer={answer} 
              onEvaluationGenerated={handleEvaluationGenerated} 
              aiChoice={aiChoice} 
              disabled={!answer}
              // disabled={!answer || isEvaluationGenerated}

            />              
            </Card.Header>
            <Card.Body>
              {/* <Card.Subtitle className="mb-2">你的回答: {answer}</Card.Subtitle> */}
              <Card.Text style={{   whiteSpace: 'pre-line',textAlign: 'left' }}>
                {answer} {evaluation}
              </Card.Text>
            </Card.Body>
            
          </Card>
        </Col>
        <Col md={12} className="mt-3 d-flex justify-content-end">
          <Button variant="outline-primary" onClick={fetchAndPlayQuestion} className="mr-2">
            继续
          </Button>
          <Button  variant="outline-dark" onClick={endPractice}>完成</Button></Col>
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
