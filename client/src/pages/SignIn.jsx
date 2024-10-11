import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:2000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 403) {
        // Handle expired token scenario..
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(data.msg || 'Sign In failed');
      }

      // Store the token and user id in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id); 
      localStorage.setItem('role', data.role); 
      console.log("role-:", data.role); 
    
    
      navigate('/profile');
    } 
    catch (error) {
      setError(error.message);
      console.error('Error during sign-in:', error);
    }
  };

  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-all duration-300"
          >
            Sign In
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">New user? </span>
          <NavLink 
            to="/signup" 
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
