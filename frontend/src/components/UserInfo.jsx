// UserInfo.jsx
import React, { useContext, useEffect, useState  } from 'react';
import axios from 'axios'; 

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Card, Button, Modal, Container, Row, Col, Alert } from 'react-bootstrap';
// import { Gravatar } from 'react-gravatar'; // 假设使用 Gravatar

const UserInfo = () => {
  const { authData, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false); // 新增状态控制确认模态框的显示
  // 显示确认删除的模态框
  const confirmDelete = () => {
    setShowConfirmModal(true);
  };
  // const avatarUrl = `https://www.gravatar.com/avatar/${md5(authData.user?.email || '')}`;
  const [userData, setUserData] = useState(null); // 新增状态，用于存储用户数据

    // 获取用户信息
    useEffect(() => {
      const fetchUserData = async () => {
          const token = localStorage.getItem('token');
          if (token) {
              try {
                  const response = await axios.get('http://localhost:8000/users/me', {
                      headers: { Authorization: `Bearer ${token}` }
                  });
                  setUserData(response.data);
              } catch (error) {
                  console.error('Error fetching user data:', error);
              }
          }
      };
      fetchUserData();
  }, []);

  useEffect(() => {
    if (!authData.isAuthenticated) {
      navigate('/login');
      // 用户未认证时 ，重定向到登录页
    }
  }, [authData.isAuthenticated, navigate]);

  // 用户名显示逻辑
  const username = authData.user?.username || 'Unknown';

  // 处理注销逻辑
  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  // 真正的删除账号逻辑
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
          headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete('http://localhost:8000/users/me', config);
      handleLogout(); // 删除账号后，注销用户
    } catch (error) {
      // 这里处理任何来自axios的错误
      console.error('Failed to delete account:', error);
      // 显示错误信息给用户
    } finally {
      setShowConfirmModal(false); // 无论成功或失败，都关闭模态框
    }
  };


  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg="8">
            <Card className="shadow">
              <Card.Body>
                <div className="text-center">
                   {/* 用户头像 */}
                   {/* {avatarUrl && <img src={avatarUrl} className="rounded-circle mb-3" alt="User Avatar" />} */}
                  {/* 用户信息区 */}
                  <h3>{userData?.username || '个人信息'}<span className="font-weight-light"></span></h3>
                  <div className="h6 font-weight-300">
                  <i class="fa-solid fa-location-dot"/>
                    {userData?.email || 'No email provided'}
                  </div>
                  {/* 其他个人信息 */}
                </div>

                <div className="mt-5 py-5 border-top text-center">
                  {/* 附加信息或简介 */}
                </div>

                <div className="text-center">
                  <Button variant="primary" onClick={handleLogout}>退出登录</Button>
                  <Button variant="danger" onClick={confirmDelete}>删除账号</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 确认删除模态框 */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
              <Modal.Title>确认删除账号</Modal.Title>
          </Modal.Header>
          <Modal.Body>您确定要删除您的账号吗？此操作无法撤销。</Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                  取消
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount}>
                  删除账号
              </Button>
          </Modal.Footer>
        </Modal>
    </>
  );
}

export default UserInfo;
