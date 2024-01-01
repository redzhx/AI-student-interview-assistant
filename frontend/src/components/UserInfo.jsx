// src/components/UserInfo.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserInfo = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>; // 或者任何其他的占位内容
  }

  return (
    <div>
            Username: {currentUser.username}

    </div>
  );
}

export default UserInfo;
