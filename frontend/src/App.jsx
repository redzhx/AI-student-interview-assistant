// import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './components/SettingsContext';
import Navbar from './components/Navbar';
import History from './pages/History';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Interview from './pages/Interview';
import './custom.css'; // 导入 Bootstrap 样式

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // 导入 Bootstrap 样式

function App() {

  return (
    <SettingsProvider>

      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice  />} /> 
            <Route path="/interview" element={<Interview  />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>

      </Router>
    </SettingsProvider>

  );
}

export default App;
