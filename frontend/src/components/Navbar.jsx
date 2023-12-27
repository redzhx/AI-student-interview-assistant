import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../styles/navbar-styles.css'; 

function CustomNavbar() {

  return (
    <>
    <Navbar expand="lg" className="" variant="light">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="/logo512.png" alt="Logo" className="logo" /> 面小狮
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link  as={Link} to="/history">练习记录</Nav.Link>
            <Nav.Link  as={Link} to="/login">登录</Nav.Link>
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
}

export default CustomNavbar;
