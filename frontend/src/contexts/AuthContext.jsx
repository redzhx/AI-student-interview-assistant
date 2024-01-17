// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext({
    authData: {
      isAuthenticated: false,
      user: null,
      token: null
    },
});


export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    user: null,
    token: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username'); 
    if (token && savedUsername) {
        setAuthData({
            isAuthenticated: true,
            user: { username: savedUsername },
            token: token
        });
    }
}, []);

const setAuthInfo = ({ access_token, username }) => {
    console.log('Setting auth info:', { access_token, username }); // 打印查看设置的数据
    localStorage.setItem('token', access_token);
    localStorage.setItem('username', username); // 保存用户名到本地存储
    setAuthData({
      isAuthenticated: true,
      user: { username },  // 这里保存用户信息
      token: access_token
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');  // 移除用户名
    setAuthData({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
