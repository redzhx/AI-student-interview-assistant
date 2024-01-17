import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, InputGroup, Card, Container, Row, Col,Alert } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false); // 新增状态，表示是否注册成功


    const isPasswordValid = (password) => {
        return password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password) && /\W/.test(password);
    };

    // 添加简单的前端验证逻辑
    const validateForm = () => {
        if (!username.trim()) return "Username is required";
        if (!isPasswordValid(password)) return "密码应不少于8个字符,至少有一个大写字母，一个数字和一个特殊字符";
        if (password !== confirmPassword) return "两次密码不一致，请重试";
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(''); // 清除之前的错误消息

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false); // 出现错误时重置 loading 状态
            return;}

        if (!isPasswordValid(password)) {
            setError("Password must be at least 8 characters long and include a number, an uppercase letter, and a special character.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await axios.post('http://localhost:8000/register', { username, password });
            setIsRegistered(true); // 设置注册成功状态
            // navigate('/login');
            setLoading(false);

        } catch (error) {
            console.error('出错啦!', error);
            setError(error.response?.data?.message || "注册不成功.");
            setLoading(false); // 出现错误时重置 loading 状态
        }
    };
    // 如果注册成功，展示成功信息并提供导航选项
    if (isRegistered) {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg="5">
                        <Alert className="alert-success text-white">
                            注册成功！欢迎来到面小狮的小世界.
                        </Alert>
                        <div className="text-center">
                            <Button variant="primary" onClick={() => navigate('/login')}>
                                转到登录页面
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }


return (
    <Container className="mt-5">
        <Row className="justify-content-center">
            <Col lg="5">
                <Card>
                    <Card.Header>
                        <h3 className="text-center">注册账号</h3>
                    </Card.Header>
                    <Card.Body>
                        {error && <Alert className="alert-danger text-white">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3 gray-text-icon">
                                <InputGroup>
                                    <InputGroup.Text>
                                    <i class="fa-solid fa-user-graduate"/>                              </InputGroup.Text>
                                    <Form.Control 
                                        type="text" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value.trim())} 
                                        placeholder="用户名" 
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3 gray-text-icon">
                                <InputGroup>
                                    <InputGroup.Text >
                                    <i class="fa-solid fa-unlock-keyhole"/>                               </InputGroup.Text>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="密码"
                                    />
                                    <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <i class="fa-regular fa-eye"/> :<i class="fa-regular fa-eye-slash"/>}
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3 gray-text-icon">
                                <InputGroup>
                                    <InputGroup.Text>
                                    <i class="fa-solid fa-unlock-keyhole"/>                                 </InputGroup.Text>
                                    <Form.Control
                                        type={showConfirmPassword ?
                                        "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="确认密码"
                                        />
                                    <InputGroup.Text onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <i class="fa-regular fa-eye"/> :<i class="fa-regular fa-eye-slash"/>}
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? '加载中...' : '提交注册'}
                        </Button>
                        
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <div className="text-center">
                        已有账号? <a href="/login">登录</a>
                    </div>
                </Card.Footer>
            </Card>
        </Col>
    </Row>

</Container>
);
}



export default Register;
