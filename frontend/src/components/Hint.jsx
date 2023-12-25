// Hint.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

function HintButton({ onHintRequest }) {
    return (
        <Button onClick={onHintRequest}>太难了，给点提示</Button>
    );
}

export default HintButton;
