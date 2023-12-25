import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar-styles.css'; // 引入外部的CSS文件
import { Navbar, Nav, Button, Container,Offcanvas, NavDropdown } from 'react-bootstrap';
import ControlPanel from './ControlPanel'; // 确保正确导入 ControlPanel 组件
import { useSettings } from './SettingsContext';


function CustomNavbar({  }) {
  const [showOffcanvas, setShowOffcanvas] = React.useState(false);
  const { ttsService, setTtsService, sttService, setSttService, evaluationService, setEvaluationService } = useSettings();

  return (
    <>
    <Navbar expand="lg" className="" variant="light">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="/logo512.png" alt="Logo" className="logo" /> 智能面试小助手
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link  as={Link} to="/history">练习记录</Nav.Link>
            <Nav.Link  as={Link} to="/login">登录</Nav.Link>
          </Nav>
          <Button id="contolbtn" className=" ml-3"onClick={() => setShowOffcanvas(true)}>
          <i class="fa-solid fa-gear"></i>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>

      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>设置</Offcanvas.Title>
        </Offcanvas.Header>
      <Offcanvas.Body>
        <ControlPanel 
          /* 传入 ControlPanel 所需的 props */
        />
      </Offcanvas.Body>
      </Offcanvas>
    </>

  );
}




export default CustomNavbar;
