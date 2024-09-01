import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin'); 
        return;
      }
  
      try {
        const response = await fetch('http://localhost:2000/api/auth/get-user-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, //authorization header me token bhejdia..middleware nikal lega aur authenticated h ya ni check krlega jwt se, aur fir response bhejega
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(errorData.message || 'Server error');
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching user info:', error);
      }
    };
  
    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {userInfo ? (
          <div>
            <p className="text-gray-700"><strong>Username:</strong> {userInfo.username}</p>
            <p className="text-gray-700"><strong>Email:</strong> {userInfo.email}</p>
            <p className="text-gray-700"><strong>Address:</strong> {userInfo.address}</p>
          </div>
        ) : (
          <p className="text-gray-700">Loading...</p>
        )}
        <button
          onClick={handleLogout}
          className="mt-4 w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-lg hover:bg-red-600 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

