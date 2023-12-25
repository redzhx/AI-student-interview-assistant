// TextInput.jsx
import React, { useState, useEffect } from 'react';

function TextInput({ onTextSubmit,  }) {
  const [input, setInput] = useState('');

  useEffect(() => {
    onTextSubmit(input); // 每次 input 更改时更新父组件的状态
  }, [input, onTextSubmit]);



  return (
    <div className="textarea-container my-3">
      <textarea
      value={input}
      onChange={e => setInput(e.target.value)}
      className="form-control"
      rows="4" // 设置文本区域的行数，根据需要调整
      placeholder="输入内容"
      />
 </div>
  );
}

export default TextInput;
