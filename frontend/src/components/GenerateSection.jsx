// GenerateSection.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSettings } from './SettingsContext';

import { Button } from 'react-bootstrap';

function GenerateSection({ currentQuestion, answer, onEvaluationGenerated, disabled }) {
    const { aiChoice } = useSettings();
    // const [evaluation, setEvaluation] = useState('');
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

        try {
            const response = await axios.post(`${apiUrl}/api/generate`, {
                question: currentQuestion.question,  
                user_response: answer, 
                ai: aiChoice
            });
            // setEvaluation(response.data);
            if (onEvaluationGenerated) {
                onEvaluationGenerated(response.data); // 通知父组件生成的评价
            }
            // saveRecord(currentQuestion.question, answer, response.data); 
            saveRecord(questionText, answer, response.data);

            setIsLoading(false);
        } catch (error) {
            console.error('Error generating evaluation:', error);}

       
        setIsLoading(false);
        
    };

            // if (!answer) return; // 确保有答案再生成评价
        //  setIsLoading(true);

    return (
        <div>
        <Button className="my-1"
            onClick={generateEvaluation} 
            disabled={!answer || isLoading|| disabled} // 确保在没有答案时禁用按钮
            title={!answer ? "请先完成答案的输入" : ""}
            >
            {isLoading ? '生成中...' : '生成评价'}
        </Button>
      </div>
    );
}

export default GenerateSection;
