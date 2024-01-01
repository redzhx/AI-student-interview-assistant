// components/SettingsContext.jsx
import React, { createContext, useState, useContext } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [ttsService, setTtsService] = useState('browser');
  const [sttService, setSttService] = useState('openai');
  const [aiChoice, setAiChoice] = useState('zhipuai');
  const [isMuted, setIsMuted] = useState(false); // 添加静音模式的状态


  return (
    <SettingsContext.Provider value={{ ttsService, setTtsService, sttService, setSttService, aiChoice, setAiChoice, isMuted, setIsMuted }}>
      {children}
    </SettingsContext.Provider>
  );
};
