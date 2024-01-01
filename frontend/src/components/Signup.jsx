import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post(`${apiUrl}/api/signup`, { 
                username,
                email,
                password 
            });
            console.log(response.data);

            // 处理响应
            navigate('/login'); // 注册成功后导航到登录页面
        } catch (error) {
            if (error.response && error.response.data) {
                // 提取并显示适合的错误信息
                setErrorMessage(error.response.data.detail || '未知错误');
            } else {
                setErrorMessage("注册时发生错误");
            }
        }
    };

    return (
        <div className="signup-container">
        <h2>注册</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSignup}>
        <div>
                    <label>用户名:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>电子邮件:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>密码:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">注册</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
);
}

export default Signup;
