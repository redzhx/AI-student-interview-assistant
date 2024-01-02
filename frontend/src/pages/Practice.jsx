// Practice.jsx
import React, { useState } from 'react';
import axios from 'axios';
import QuestionDisplay from '../components/QuestionDisplay';
import AnswerSection from '../components/AnswerSection-0';
import GenerateSection from '../components/GenerateSection';
import { useSettings } from '../components/SettingsContext';
import { Container,Row,Button, Card,Col,Collapse,Tab,Nav } from 'react-bootstrap'; // 确保这一行存在于文件顶部
import PracticeEndModal from '../components/PracticeEndModal';
import ControlPanel from '../components/ControlPanel'; // 确保正确导入 ControlPanel 组件
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function Practice() {
  const [mode, setMode] = useState('random'); // 默认模式为随机
  const [customQuestion, setCustomQuestion] = useState(''); // 用户自定义题目
  const [showCustomQuestionInput, setShowCustomQuestionInput] = useState(false); // 新增状态

  const [currentQuestion, setCurrentQuestion] = useState({});
  const [showModeSelection, setShowModeSelection] = useState(true); // 新增状态用于控制是否显示模式选择界面

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
  // const [loadingHint, setLoadingHint] = useState(false);
  const { ttsService } = useSettings(); // 从 SettingsContext 获取 TTS 配置
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');


  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
    setShowCustomQuestionInput(selectedMode === 'custom'); // 当选择自定义模式时显示输入框
    resetContent(); // 重置所有与答题相关的内容
    setIsQuestionGenerated(false); // 重置问题生成状态
    setCurrentQuestion({}); // 清空当前问题


    // 根据选择的模式进行相应操作...
  };


  const resetContent = () => {
    // setCurrentQuestion({});
    setCustomQuestion(''); // 重置自定义题目
    setAnswer('');
    setEvaluation('');
    setIsEvaluationGenerated(false);
    // setIsQuestionGenerated(false); // 标记题目未生成
    setQuestionCount(0); // 根据需要调整
    setHint('');
    setResetKey(prev => prev + 1); // 更新重置键

    // 其他需要重置的状态...
  };

  // 统一的开始答题函数
  const startPractice = async () => {
    resetContent();
    switch (mode) {
      case 'random':
        await fetchRandomQuestion();
        setIsQuestionGenerated(true);
        break;
      case 'ai':
         fetchAIQuestion();
        // setIsQuestionGenerated(true);
        break;
      case 'custom':
        setShowCustomQuestionInput(true); // 在自定义模式下重新显示输入框
        setCurrentQuestion({ question: customQuestion, source: '用户自定义' });
        setIsQuestionGenerated(true);
        setCustomQuestion(''); // 重置自定义题目

        break;
      default:
        console.error('未知的出题模式');
    }
  };


  // 自定义题目的输入处理
  const handleCustomQuestionChange = (event) => {
    setCustomQuestion(event.target.value);
  };

  const submitCustomQuestion = () => {
    const questionWithSymbol = "🦁 "+customQuestion; // 在题目后面加上符号
    setCurrentQuestion({ question: questionWithSymbol });

    setIsQuestionGenerated(true); // 标记题目已生成
    setShowCustomQuestionInput(false); // 隐藏自定义题目输入框
    setCustomQuestion(''); // 添加这行来重置 customQuestion 为初始状态

  };

  // 根据题目来源渲染题目显示
  const renderQuestion = () => {
    return (
      <div>
      </div>
    );
  };

    // 根据模式渲染标题
    const renderTitle = () => {
      let title = '';
      switch (mode) {
        case 'random':
          title = '随机出题';
          break;
        case 'ai':
          title = 'AI出题';
          break;
        case 'custom':
          title = '自己出题';
          break;
        // ... 可以添加更多模式的处理 ...
        default:
          title = '选择出题模式（开发中）';
      }
      return <h2 className="text-center">{title}</h2>;
    };

    // 获取问题的函数
    const fetchRandomQuestion = async () => {
      try {
          const response = await axios.get(`${apiUrl}/api/get-question`);
          if (response.data) {
              setCurrentQuestion(response.data);
              setIsEvaluationGenerated(false); // 重置生成评价状态
              setAnswer(''); // 清空答案
              setEvaluation(''); // 清空评价
              setIsQuestionGenerated(true);
              setResetKey(prev => prev + 1); // 更新重置键
              setOpen(false);  // 关闭折叠面板
              setHint('');

              // await generateHint(response.data.question); // 假设问题数据中包含问题文本

          } else {
              console.error('No question received');
          }
      } catch (error) {
          console.error('Error fetching question:', error);
      }
      

  };


// 定义从AI获取题目的函数
const fetchAIQuestion = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/ai-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ai: aiChoice }) // 确保传递正确的AI选项
    });

    const reader = response.body.getReader();
    let questionStream = '';

    // 处理流数据
    reader.read().then(function processStream({ done, value }) {
      if (done) {
        setCurrentQuestion({ question: questionStream });
        setIsQuestionGenerated(true);
        return;
      }

      const chunk = new TextDecoder("utf-8").decode(value);
      questionStream += chunk;

      return reader.read().then(processStream);
    });

  } catch (error) {
    console.error('Error fetching AI generated question:', error);
  }
};

// 定义生成提示的函数
const generateHint = async (question) => {
  // setLoadingHint(true);
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
        // setLoadingHint(false);
        // setOpen(true); // 当读取完成时展开提示区域
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
    // setLoadingHint(false);
  }
};

    // 定义处理点击生成提示按钮的函数
    const handleToggleHint = () => {
      // 如果提示未生成，则先生成提示
      if (!hint && currentQuestion && currentQuestion.question) {
        generateHint(currentQuestion.question);
      }
      // 切换折叠面板的状态
      setOpen(!open);
    };

//处理提交的答案
  const handleAnswerSubmit = (submittedAnswer) => {
    setAnswer(submittedAnswer);
};


//处理生成的评价
  const handleEvaluationGenerated = (generatedEvaluation) => {
    setEvaluation(generatedEvaluation); // 更新评价状态
    setIsEvaluationGenerated(true); // 设置生成评价后的状态
    setQuestionCount(questionCount + 1); // 递增答题计数器
  };


const endPractice = () => {
  setShowEndModal(true);
};


const handleTabChange = (tabKey) => {
  setActiveTab(tabKey);
};


return (
  <Container  className="py-4 my-4 ">
    {renderTitle()}  {/* 显示当前模式的标题 */}
    {/* 控制面板按钮 */}    
    <div  className="mt-2 ">
        <Button
          id="controlbtn" 
          className="  shaking-btn outline-primary"
          onClick={() => setShowControlPanel(true)}
        >
        <i class="fa-solid fa-robot"></i>     
        </Button> 
    </div>
    <Row className="justify-content-center">
      <Col lg={8} className="practicecard shadow my-4">
        {/* 自定义题目 */}
        <div   className="my-3">
          {/* 出题和答题界面 */}
            {/* 用户自定义题目输入 */}
            {mode === 'custom' && showCustomQuestionInput && (
              <div>
                <input  className="me-3 border-0 bg-secondary" type="text"       
                placeholder="输入你自己的题目"
                value={customQuestion} onChange={handleCustomQuestionChange} />
                <Button variant="success" size="sm" onClick={submitCustomQuestion}>提交</Button>
              </div>
            )}
              {isQuestionGenerated && renderQuestion()}
        </div>
        {/* 进入开始 */}
        <div  className=" mb-3 d-flex justify-content-center">
            {!isQuestionGenerated && (
              <Col  className="text-center">
                
                <Button variant="outline-primary" size="lg" onClick={startPractice} className="">
                  开始答题
              </Button>
              </Col>
              )}
        </div>
        {/* 显示问题和提示 */}
      {currentQuestion.question && (
        <>
          <Col md={12} className="mb-3">
              <h5 className="displlay-3"style={{FontWeight:'bold'}}>
            
              <QuestionDisplay question={currentQuestion.question} ttsService={ttsService} />
              <Button variant="outline-success" id="round-btn" size="lg"className="btn-icon-only shaking-btn"
              onClick={handleToggleHint} 
              aria-controls="hint-collapse" 
              aria-expanded={open}
            >
              <i class="fa-regular fa-lightbulb"></i>
            </Button></h5>
          </Col>
          <Col md={12} className="mb-4">
              <Collapse in={open}>
                  <div id="hint-collapse">
                      <Card id="hint">
                          <Card.Body>
                              <Card.Text style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                                💡提示: {hint}
                              </Card.Text>
                              <Button 
                                  id="round-btn"
                                  variant="outline-success" 
                                  size="sm" 
                                  onClick={handleToggleHint}
                              >
                                  <i class="fa-solid fa-angles-up"></i>
                              </Button>
                          </Card.Body>
                      </Card>
                  </div>
              </Collapse>
          </Col>
        </>
      )}
      </Col>
    </Row>

    {isQuestionGenerated && (    
    <Row className="justify-content-center">
    <Col lg={8} className="practicecard shadow py-2 my-4 md-3">

      <Tab.Container id="practice-tabs" defaultActiveKey="tab1">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="tab1">回答</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
            eventKey="tab2"
            className={answer ? "bouncing-tab" : ""}
            style={{ color: answer ? '' : '' }}
            >评价</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="tab1">
              {currentQuestion.question && (
                <AnswerSection 
                onAnswerSubmit={handleAnswerSubmit} 
                key={resetKey} // 使用 key 来重置组件状态
                disabled={isEvaluationGenerated}
              /> 
              )}               
          </Tab.Pane>
          <Tab.Pane eventKey="tab2">
            <Row>
              {currentQuestion.question && (
                <Col lg={8} className="my-1 ">
                {isQuestionGenerated && (
                
                    <div  className="my-3">
                        <GenerateSection 
                          currentQuestion={currentQuestion}
                          answer={answer} 
                          onEvaluationGenerated={handleEvaluationGenerated} 
                          // aiChoice={aiChoice} 
                          disabled={!answer}
                          resetKey={resetKey} // 传递重置键作为重置信号
                          // disabled={!answer || isEvaluationGenerated}
                        />              
                    </div>

                )}     
                </Col>    
                )}
            </Row>
          </Tab.Pane>
        </Tab.Content>
        </Tab.Container>
 
      </Col>
      </Row>
         )}
      {/* 控制组件继续或离开按钮 */}
      {isQuestionGenerated && (
        
          <Col md={12} className="mt-3 d-flex justify-content-end">
          <Button variant="outline-primary" onClick={startPractice} className="mr-2 btn-icon-only">
            <i class="fa-solid fa-circle-chevron-right"></i>
            </Button>
            <Button  variant="outline-dark" className="btn-icon-only" onClick={endPractice}><i class="fa-solid fa-right-from-bracket"></i></Button>
            </Col>
          )
      }
      <PracticeEndModal 
        show={showEndModal} 
        onHide={() => setShowEndModal(false)} 
        questionCount={questionCount}
      />
      {/* 控制面板的显示 */}

      <ControlPanel show={showControlPanel} onHide={() => setShowControlPanel(false)} setMode={handleModeSelection}  />
</Container>

);
}

export default Practice;
