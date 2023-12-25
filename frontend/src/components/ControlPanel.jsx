import React from 'react';
import { Form } from 'react-bootstrap';
import { useSettings } from './SettingsContext'; // 确保路径正确

function ControlPanel() {

const { isMuted, setIsMuted,ttsService, setTtsService, sttService, setSttService, evaluationService, setEvaluationService } = useSettings();
  
  return (
    <div className="control-panel">
      <Form>
           <Form.Group>
              <Form.Label>文本转语音服务</Form.Label>
              <Form.Control 
                as="select" 
                value={ttsService}
                onChange={(e) => {
                  const selectedService = e.target.value;
                  setTtsService(selectedService);
                  setIsMuted(selectedService === "mute"); // 如果选择了静音，则设置静音状态
                }}
              >
                <option value="mute">静音</option> {/* 静音选项 */}
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
                value={evaluationService}
                onChange={(e) => setEvaluationService(e.target.value)}
              >
                <option value="zhipuai">Zhipuai</option>
                <option value="openai">OpenAI</option>
              </Form.Control>
            </Form.Group>
          </Form>

    </div>
  );
  }

export default ControlPanel;
