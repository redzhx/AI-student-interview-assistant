// GenerateSection.jsx
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useSettings } from './SettingsContext';

import {Card } from 'react-bootstrap';

function GenerateSection({ currentQuestion, answer, onEvaluationGenerated ,resetKey,disabled}) {
    const { aiChoice } = useSettings();
    const [evaluation, setEvaluation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const questionText = currentQuestion.question; // From currentQuestion object, extract question text
    
    useEffect(() => {
        setEvaluation(''); // 当重置键变化时重置评价
    }, [resetKey]);


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
        if (!answer) { // 检查是否已提供答案
            alert("请先完成答案的输入");
            return;
        }
    
        setIsLoading(true); // 设置加载状态为真
    
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
            const processStream = async ({ done, value }) => {
                if (done) {
                    setIsLoading(false); // 设置加载状态为假
                    setEvaluation(evaluationStream); // 设置评价内容
                    if (onEvaluationGenerated) {
                        onEvaluationGenerated(evaluationStream); // 将生成的评价传递给父组件
                    }
                    saveRecord(currentQuestion.question, answer, evaluationStream); // 保存记录
                    return;
                }
    
                // 将 Uint8Array 转换为字符串
                const chunk = new TextDecoder("utf-8").decode(value);
                evaluationStream += chunk;
                setEvaluation(evaluationStream); // 实时更新评价
    
                // 继续读取下一块数据
                reader.read().then(processStream);
            };
    
            reader.read().then(processStream);
        } catch (error) {
            console.error('Error generating evaluation:', error);
            setIsLoading(false); // 出错时设置加载状态为假
        }
    };
    

    return (
        <div id="judgearea" className='mb-3'>
            <Card>
                <Card.Header id="judgeareah" variant="primary" className="mb-1 py-2 text-center"
                    onClick={!evaluation ? generateEvaluation : null} // 仅在没有评价时才能点击
                    disabled={!answer || isLoading || disabled || evaluation} // 如果没有答案、正在加载、已禁用或已生成评价，则禁用按钮
                    title={!answer ? "请先输入答案" : ""}
                >
                    <h6 className='text-primary mt-2'><i class="fa-solid fa-robot"></i> 评价</h6>
                </Card.Header> 
                <Card.Body>
                    <Card.Text style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                        {answer} <br/>
                        {evaluation}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}
export default GenerateSection;
