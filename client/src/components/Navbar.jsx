import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [suggestions, setSuggestions] = useState([]); 

  const navigate= useNavigate();

  const handleAccountClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');  
    } else {
      navigate('/signin');  
    }
  };

 
  const fetchSuggestions = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await fetch(`http://localhost:2000/api/auth/search-books?title=${searchTerm}`);
        const suggestionss = await response.json();

        if (response.ok) {
          setSuggestions(suggestionss);
        } else {
          setSuggestions([]); 
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]); 
      }
    } else {
      setSuggestions([]); 
    }
  };

  // handle search when a suggestion is selected..
  const handleSearchSelect = (bookId) => {
    navigate(`/get-book-details/${bookId}`); 
    setSearchTerm(''); 
    setSuggestions([]); 
  };

  
  const clearSuggestions = () => {
    setSuggestions([]);
    setSearchTerm('');
  };

  //handle clicks outside the search box..
  useEffect(() => {
    
    const handleClickOutside = (event) => {
      if (event.target.closest('.search-container') === null) {
        clearSuggestions(); 
      }
    };

    document.addEventListener('click', handleClickOutside);

    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white p-4 shadow">
      <div className="flex items-center">
        
        <div className="pl-16 text-5xl font-serif font-bold text-gray-800">
          TaleTown
        </div>

        <ul className="flex  space-x-10 ml-16 text-lg">
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
              to="/books" 
              className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700'}
            >
              All Books
            </NavLink>
          </li>
        </ul>

        <div className="ml-12 flex-grow relative search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              fetchSuggestions(); 
            }} 
            placeholder="Search books..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border rounded mt-1 w-full z-10">
              {suggestions.map((book) => (
                <li 
                  key={book._id} 
                  onClick={() => handleSearchSelect(book._id)} 
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {book.title} by {book.author} 
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ml-8 flex items-center space-x-6 pr-12">

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
