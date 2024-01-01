// login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';


    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();


        try {
            const response = await axios.post(`${apiUrl}/api/login`,{ username, password });
            auth.login(response.data.token);  // 假设 token 在响应数据中

        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('登录失败：无效的用户名或密码');
            } else {
                alert('登录请求失败：' + error.message);
            }
        }
    };
    return (
        <div>
            <h2>登录</h2>
            <span/>
            <span/>
            <p>测试阶段，模拟登录，可使用user:test, pw:test</p>
            <form onSubmit={handleLogin}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;