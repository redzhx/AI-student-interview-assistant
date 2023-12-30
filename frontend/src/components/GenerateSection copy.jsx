// GenerateSection.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSettings } from './SettingsContext';

import { Button } from 'react-bootstrap';

function GenerateSection({ currentQuestion, answer, onEvaluationGenerated, disabled }) {
    const { aiChoice } = useSettings();
    const [evaluation, setEvaluation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const questionText = currentQuestion.question; // From currentQuestion object, extract question text


    const saveRecord = async (questionText, answerText, evaluationText) => {
        try {
            await axios.post(`${apiUrl}/api/create`, { 
                question: questionText, 
                answer: answerText, 
                content: evaluationText 
            });
            // Add logic for successful save
        } catch (error) {
            console.error('Error saving record:', error);
            // Add logic for failed save
        }
    };
    const generateEvaluation = async () => {
        if (!answer) {
            alert("请先完成答案的输入");
            return;
        }
        setIsLoading(true);
        // setEvaluation(''); // 清空先前的评价
    
        try {
            const response = await fetch(`${apiUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: currentQuestion.question,  
                    user_response: answer, 
                    ai: aiChoice
                })
            });
    
            const reader = response.body.getReader();
            let evaluationStream = '';
    
            // 处理流数据
            reader.read().then(function processStream({ done, value }) {
                if (done) {
                    setIsLoading(false);
                    if (onEvaluationGenerated) {
                        onEvaluationGenerated(evaluationStream); // 通知父组件生成的评价
                    }
                    saveRecord(currentQuestion.question, answer, evaluationStream);
                    return;
                }
    
                // 将 Uint8Array 转换为字符串
                const chunk = new TextDecoder("utf-8").decode(value);
                evaluationStream += chunk;
                setEvaluation(evaluationStream); // 实时更新评价
    
                // 读取下一块数据
                return reader.read().then(processStream);
            });
    
        } catch (error) {
            console.error('Error generating evaluation:', error);
            setIsLoading(false);
        }
    };
    

    return (
        <>
        <Button className="my-1"
            onClick={generateEvaluation} 
            disabled={!answer || isLoading|| disabled} // 确保在没有答案时禁用按钮
            title={!answer ? "请先完成答案的输入" : ""}
            >
            {/* {isLoading ? '生成中...' : '查看评价'} */}
            生成评价
        </Button>
        {/* {evaluation} */}
      </>
    );
}

export default GenerateSection;
