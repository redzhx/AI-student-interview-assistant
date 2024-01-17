// Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, InputGroup, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { setAuthInfo } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await axios.post('http://localhost:8000/token', formData);
            // 确保后端响应包含用户名和令牌
            console.log('Login response:', response.data); // 打印查看响应结构

            const { access_token, username: loggedInUsername } = response.data;
            setAuthInfo({ access_token, username: loggedInUsername }); // 正确更新 AuthContext
            navigate('/'); // 登录后跳转至首页
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please check your credentials.');
        }
        setLoading(false);

    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
 
    return (
        <>
        <div className="position-relative ">
          {/* Hero */}
          <section className="section section-lg section-shaped">
            {/* Background circles */}
            {/* <div className="shape shape-style-1 shape-default">
              <span className="span-150" />
              <span className="span-50" />
              <span className="span-50" />
              <span className="span-75" />
              <span className="span-100" />
              <span className="span-75" />
              <span className="span-50" />
              <span className="span-100" />
              <span className="span-50" />
              <span className="span-100" />

            </div> */}
            <Container className="shape-container py-lg ">
                <Row className="align-items-center justify-content-center">
                    <Col className="text-center" lg="6" md="8">
                        <Card style={{ position: 'relative', zIndex: '1' }}>
                            <Card.Header>
                                <div className="text-center">
                                    <h3>登录</h3>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3 gray-text-icon">
                                        <InputGroup>
                                            <InputGroup.Text>
                                            <i class="fa-regular fa-user"/>                                         </InputGroup.Text>
                                            <Form.Control 
                                                type="text" 
                                                value={username} 
                                                onChange={(e) => setUsername(e.target.value)} 
                                                placeholder="用户名" 
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group className="mb-3 gray-text-icon">
                                        <InputGroup>
                                            <InputGroup.Text>
                                            <i class="fa-solid fa-unlock-keyhole"/>                                       
                                            </InputGroup.Text>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="密码"
                                            />
                                            <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                                {showPassword ? <i class="fa-regular fa-eye"/> :<i class="fa-regular fa-eye-slash"/>}
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                    <Button variant="primary" type="submit" block>
                                        {loading ? '加载中...' : '登录'}
                                    </Button>
                                </Form>
                            </Card.Body>
                            <Card.Footer>
                                <div className="text-center">
                                    <Link to="/register">注册新账号</Link>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
         
            </section>
            
            </div>
        </>
    );
}

export default Login;
