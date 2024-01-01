// control panel
import React from 'react';
import { Button, Form ,Offcanvas} from 'react-bootstrap';
import { useSettings } from './SettingsContext'; // 确保路径正确

function ControlPanel({ show, onHide,setMode }) {

  const { isMuted, setIsMuted, ttsService, setTtsService, sttService, setSttService, aiChoice, setAiChoice } = useSettings();
  const handleTtsServiceChange = (selectedService) => {
    setTtsService(selectedService);
    setIsMuted(selectedService === "mute");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };


  return (

    <Offcanvas className="control-panel"show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>设置</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
      <Form>
         {/* 静音切换按钮 */}
         <Button id="mutebtn" variant="success" className="my-4" onClick={toggleMute}>
         <i className={`fa-solid ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>

              {isMuted ? "" : ""}
            </Button>
           <Form.Group>
              <Form.Label>文本转语音服务</Form.Label>
              <Form.Control 
                as="select" 
                value={ttsService}
                onChange={(e) => handleTtsServiceChange(e.target.value)}
              >
                {/* <option value="mute">静音</option>  */}
                <option value="browser">浏览器内置 TTS</option>
                <option value="minimax">Minimax</option>
                <option value="openai">OpenAI</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>语音转文本服务</Form.Label>
              <Form.Control 
                as="select" 
                value={sttService}
                onChange={(e) => setSttService(e.target.value)}
              >
                <option value="openai">OpenAI STT</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>生成评价服务</Form.Label>
              <Form.Control 
                as="select" 
                value={aiChoice}
                onChange={(e) => setAiChoice(e.target.value)}
              >
                <option value="zhipuai">Zhipuai</option>
                <option value="openai">OpenAI</option>
              </Form.Control>
            </Form.Group>
            {/* 出题模式选择 */}
            <br/>
            <div className='bg-white py-3'>
            <h6>选择出题方式</h6>
              <Button variant="primary" size="sm" className="my-3" onClick={() => setMode('random')}>
                随机真题
              </Button>
              <Button variant="success" size="sm"className="my-3" onClick={() => setMode('custom')}>
                自己出题
              </Button>
              <Button variant="warning" size="sm"className="my-3" onClick={() => setMode('ai')}>
                AI出题
              </Button>
              <Button variant="danger"  size="sm" className="my-3"  onClick={() => setMode('library')}>
                查看题库
              </Button><br/>
            </div>
        </Form>
        </Offcanvas.Body>
    </Offcanvas>
    
  );
  }

export default ControlPanel;
