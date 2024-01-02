import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // 假设使用 react-bootstrap 的 Modal 和 Button

function PracticeEndModal({ show, onHide, questionCount }) {
  const navigate = useNavigate();

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>

      <Modal.Title className='text-center'><div>🦁</div></Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div><img src="/interest-fre-header.png" alt="congrats" className="img-fluid mt-4" /></div>

        <div className='text-center my-4'><strong >🎉🎉恭喜你，又完成了 {questionCount} 道题目！</strong>
        <p  className='my-3'> 每一次的模拟，都是你征服梦想的小小演练。继续前进吧，你的未来一定充满无限可能！🚀📖💫💪🎊</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          回到首页
        </Button>
        {' '}
        <Button variant="secondary" onClick={() => navigate('/history')}>
          查看历史记录
        </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default PracticeEndModal;
