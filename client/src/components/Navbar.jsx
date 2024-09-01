import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();

  const handleAccountClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');  
    } else {
      navigate('/signin');  
    }
  };

  return (
    <nav className="bg-white p-4 shadow">
      <div className="flex items-center">
     
        <div className="pl-16 text-4xl font-serif font-bold text-gray-800">
          TaleTown
        </div>

    
        <ul className="flex space-x-12 ml-24">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700'}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700'}
            >
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/books" 
              className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700'}
            >
              All Books
            </NavLink>
          </li>
        </ul>

        <div className="ml-12 flex-grow">
          <input
            type="text"
            placeholder="Search books..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="ml-8 flex items-center space-x-8 pr-16">
       
          <NavLink 
            to="/favorites" 
            className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700'}
          >
            <FaHeart size={24} />
          </NavLink>

          <NavLink 
            to="/cart" 
            className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700'}
          >
            <FaShoppingCart size={24} />
          </NavLink>

          <button 
            onClick={handleAccountClick} 
            className="flex items-center space-x-2 bg-transparent border-none cursor-pointer"
          >
            <FaUserCircle size={28} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
