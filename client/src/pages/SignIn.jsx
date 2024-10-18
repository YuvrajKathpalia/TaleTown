import React, { useState } from 'react';
import { useNavigate ,NavLink} from 'react-router-dom';

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
        // Handle expired token scenario
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(data.msg || 'Sign In failed');
      }

      // Store the token and user id in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('role', data.role);
      console.log("role:", data.role);

      // Navigate to the profile page after successful login
      navigate('/profile');
    } catch (error) {
      setError(error.message);
      console.error('Error during sign-in:', error);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-300 via-indigo-400 to-indigo-400">
  <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl relative p-8 h-auto md:h-[500px]">
    
    <div className="absolute top-4 right-4">
      <button className="text-gray-500 hover:text-gray-700" onClick={handleClose}>X</button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      
      {/* left- Benefits */}
      <div className="flex flex-col bg-violet-100 p-6 rounded-md h-full">
        <h2 className="font-bold text-blue-900 font-roboto mb-10 text-4xl md:text-left">Login to enjoy a world of benefits</h2>
        <ul className="text-gray-700 space-y-5 text-2xl">
          <li className="flex items-start">
            <span className="mr-2">✔️</span> Enjoy a more personalized experience
          </li>
          <li className="flex items-start">
            <span className="mr-2">✔️</span> Get real-time updates on trending books and new releases
          </li>
          <li className="flex items-start">
            <span className="mr-2">✔️</span> Access exclusive book collections and offers
          </li>
        </ul>
      </div>

      {/* right- Sign In Form */}
      <div className="bg-white p-6 flex flex-col justify-center h-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Sign In
          </button>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            New customer?{' '}
            <NavLink 
            to="/signup" 
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >Sign Up
          </NavLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default SignIn;
