// App.jsx
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './components/SettingsContext';
import Navbar from './components/Navbar';
import History from './pages/History';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Interview from './pages/Interview';
import Register from './pages/Register';
import Login from './pages/Login';
import UserInfo from './components/UserInfo';
import './custom.css'; 

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // 导入 Bootstrap 样式

function App() {

  return (
    <AuthProvider>

    <SettingsProvider>

      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice  />} /> 
            <Route path="/interview" element={<Interview  />} />
            <Route path="/history" element={<History />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user-info" element={<UserInfo />} />

          </Routes>
        </div>
      
      </Router>
    </SettingsProvider>
    </AuthProvider>

  );
}

export default App;
