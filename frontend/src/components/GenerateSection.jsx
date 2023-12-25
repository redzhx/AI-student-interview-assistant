// GenerateSection.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

function GenerateSection({ question, answer, onEvaluationGenerated, evaluationService, disabled }) {
    const [aiChoice, setAiChoice] = useState('zhipuai');
    const [evaluation, setEvaluation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';


    const saveRecord = async (questionText, answerText, evaluationText) => {
        try {
            await axios.post(`${apiUrl}//api/create`, { 
                question: questionText, 
                answer: answerText, 
                content: evaluationText 
            });
            // 可以在这里添加提示保存成功的逻辑
        } catch (error) {
            console.error('Error saving record:', error);
            // 可以在这里添加提示保存失败的逻辑
        }
    };

    const generateEvaluation = async () => {

         if (!answer) {
            alert("请先完成答案的输入");
            return;
        }
        setIsLoading(true);

        try {
            const response = await axios.post(`${apiUrl}//api/generate`, {
                prompt: answer, // 使用传入的答案
                ai: aiChoice
            });
            setEvaluation(response.data);
            if (onEvaluationGenerated) {
                onEvaluationGenerated(response.data); // 通知父组件生成的评价
            }
            // 保存答题记录
            saveRecord(question, answer, response.data); 
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
            // disabled={isLoading || !answer || disabled} // 添加了 disabled 条件
            disabled={!answer || isLoading|| disabled} // 确保在没有答案时禁用按钮

            title={!answer ? "请先完成答案的输入" : ""}
            >
            {isLoading ? '生成中...' : '生成评价'}
        </Button>
        {/* {evaluation && <div>{evaluation}</div>} */}
      </div>
    );
}

export default GenerateSection;
