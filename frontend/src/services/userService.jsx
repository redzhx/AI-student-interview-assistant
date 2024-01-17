// userService.jsx
import axios from 'axios';

export const getUserInfo = async (token) => {
  try {
    const response = await axios.get('http://localhost:8000/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('getUserInfo response:', response);

    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};
