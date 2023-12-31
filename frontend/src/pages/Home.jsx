import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button,  } from 'react-bootstrap';
import Footer from '../components/Footer.jsx';
import Feature from '../components/Feature.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';


function Home() {
  const navigate = useNavigate();

  const handlePractice = () => {
    navigate("/practice");
  };

  const handleInterview = () => {
    navigate("/interview");
  };

  return (
    <div>
    <Container className="my-8 my-md-5 justify-content-center">
      <Row className="">
        <Col lg={7}>
          <div className="">
            <div class=" mb-5 mb-md-7">
            <h1 className="display-3 font-weight-bold mb-5 mt-5" ><strong>AI面试陪练小助手</strong></h1>
            {/* <h3 className="lead">——助你顺利通过升学面试</h3> */}
            <p class=" mb-4 mb-lg-5">🦁嗨!我是面小狮,你的升学面试小助手!</p>
            <p class=" mb-4 mb-lg-5">🚀我为你准备了各种面试题目和面试技巧,<br/>随时随地陪你练习,助你轻松考入心仪学校！<br/><br/>💪快来展现你的潜力，开始练习吧！ </p>
            <div  className='mt-5'>
              <Button variant="primary" size="lg"className=" btn-lg" onClick={handlePractice}>开始练习</Button>
              {/* <Button variant="outline-primary" size="lg" onClick={handleInterview}>模拟面试</Button> */}
            </div>
            </div>
          </div>
        </Col>
        <Col lg={5}>
          <img src="/interview.png" alt="home" className="img-fluid mt-1" />
        </Col>
        
      </Row>
      <Row className="justify-content-md-center my-5"  >

      </Row>
      
    </Container>
    <div className='my-10'><Feature/></div>
    <div className=''><Footer /></div>
    </div>
  );


}

export default Home;
