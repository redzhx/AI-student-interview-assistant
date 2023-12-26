import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Collapse, Modal } from 'react-bootstrap'; // 导入 React Bootstrap 组件
import 'bootstrap/dist/css/bootstrap.min.css'; // 导入 Bootstrap 样式
import '../App.css';

function History() {
  const [records, setRecords] = useState([]);
  const [openCollapse, setOpenCollapse] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchRecords = async () => {
      // 获取历史记录数据的逻辑
      try {
        const response = await axios.get(`${apiUrl}/api/history`);
        if (Array.isArray(response.data)) {
          setRecords(response.data.map(record => ({...record, open: false})));
        } else {
          console.log('Response data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchRecords();
  }, []);

  const handleToggleCollapse = index => {
    setOpenCollapse(prevState => ({...prevState, [index]: !prevState[index]}));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/delete/${id}`);
      setRecords(records.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      handleDelete(recordToDelete.id);
    }
    setShowConfirmModal(false);
  };

  const handleShare = (record) => {
    // 实现分享逻辑
    console.log("Sharing", record);
  };

  const handleAddToReview = (record) => {
    // 实现添加到复习计划逻辑
    console.log("Adding to review plan", record);
  };
  // 更改显示1219
  return (
    <section class="section section-lg" id="history">
      <div class="col-12 text-center mt-4 mb-4 mb-lg-5">
        <h2>练习记录</h2>
          <p class="lead">⭐️强化记忆小妙招：回顾、分享、交流⭐️</p>
      </div>
      <div class="row justify-content-center">
        <div class="col-12 col-md-8">
        {/* accordion */}
        {records.map((record, index) => (
          <Card  key={record.id} style={{ margin: '5px 20px' }}>
            <Card.Header  onClick={() => handleToggleCollapse(index)} style={{ cursor: 'pointer', textAlign: 'left' }}>
              <strong >{record.question}</strong> 
              <p className="mb-0" ><small className="text-muted">{new Date(record.created_at).toLocaleString()}</small></p>
            </Card.Header>
            <Collapse in={openCollapse[index]}>
              <div>
                <Card.Body>
                  <Card.Title></Card.Title>
                  <Card.Subtitle className="mb-2 " style={{ textAlign: 'left'}}>你的回答:{record.answer}</Card.Subtitle>

                  <Card.Text style={{   whiteSpace: 'pre-line',textAlign: 'left' }}>

                    <strong>评价:</strong><p> {record.content}</p>
                  </Card.Text>
                  
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                  <Button variant="danger" size="sm" onClick={() => {
                    setRecordToDelete(record);
                    setShowConfirmModal(true);
                  }}>删除</Button>
                  <Button variant="outline-primary" size="sm" onClick={() => handleShare(record)}>分享</Button>
                  <Button variant="outline-primary" size="sm" onClick={() => handleAddToReview(record)}>加入复习计划</Button>
                  </small>
                </Card.Footer>
              </div>
            </Collapse>
            
          </Card>
        ))}
        {/* 删除确认对话框 */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>确认删除</Modal.Title>
          </Modal.Header>
          <Modal.Body>确定要删除这条记录吗？此操作无法撤销。</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>取消</Button>
            <Button variant="danger" onClick={handleConfirmDelete}>删除</Button>
          </Modal.Footer>
        </Modal>
        </div>
      </div>
    </section>
  );
}

export default History;
