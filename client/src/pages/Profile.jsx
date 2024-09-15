import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import avatar from '../assets/images/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {

  const [user, setUser] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch('http://localhost:2000/api/auth/get-user-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const userData = await userResponse.json();
        setUser(userData);

        const favoriteResponse = await fetch('http://localhost:2000/api/auth/get-favourite-books', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const favoriteData = await favoriteResponse.json();
        setFavorites(favoriteData);

      } catch (error) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
  }

  const handleTabSwitch = (tab) => setActiveTab(tab);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* sidebar */}
      <div className="w-64 bg-white rounded-lg shadow-lg p-6 mt-10 ml-10 flex flex-col items-center h-fit">
        <div className="text-center mb-8">
          <img
            src={avatar} 
            alt="Avatar"
            className="w-20 h-20 rounded-full mb-4" 
          />
          <h2 className="text-xl font-semibold">{user.username}</h2>
        </div>
        <button
          onClick={() => handleTabSwitch('favorites')}
          className={`w-full text-left px-4 py-2 mb-4 ${activeTab === 'favorites' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'} hover:bg-blue-50 rounded`}
        >
          Favorites
        </button>
        <button
          onClick={() => handleTabSwitch('orders')}
          className={`w-full text-left px-4 py-2 mb-4 ${activeTab === 'orders' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'} hover:bg-blue-50 rounded`}
        >
          Orders
        </button>
        <button
          onClick={() => handleTabSwitch('cart')}
          className={`w-full text-left px-4 py-2 mb-4 ${activeTab === 'cart' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'} hover:bg-blue-50 rounded`}
        >
          Cart
        </button>
        <button
          onClick={() => handleTabSwitch('settings')}
          className={`w-full text-left px-4 py-2 mb-4 ${activeTab === 'settings' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'} hover:bg-blue-50 rounded`}
        >
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-1 py-2 mb-2 text-red-600 hover:bg-red-50 rounded"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
          Logout
        </button>
      </div>

      {/* main..*/}
      <div className="flex-grow bg-white p-8 m-10 rounded-lg shadow-lg">

        {/* tabs.. */}

        {activeTab === 'favorites' && (

          <div className="min-h-screen bg-white py-8 px-12">
            <div className="grid gap-16 grid-cols-1 lg:grid-cols-3 justify-items-center">
            {favorites.map((book) => (
                <Link
                  key={book._id}
                  to={`/get-book-details/${book._id}`}
                  className="relative w-56 h-[22rem] flex flex-col items-center overflow-hidden bg-white border border-gray-300 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  <div className="bg-white overflow-hidden rounded-t-lg">
                    <img
                      src={book.url}
                      alt={book.title}
                      className="mt-4 w-full h-48 object-contain"
                    />
                  </div>
                  <div className="p-4 flex flex-col h-1/3">
                    <h3 className="text-lg font-semibold mb-1 truncate">{book.title}</h3>
                    <p className="text-gray-700 italic mb-1 truncate">By {book.author}</p>
                    <p className="text-gray-600">{book.price ? `$${book.price}` : 'Price not available'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && <h3 className="text-xl font-semibold">Orders</h3>}
        {activeTab === 'cart' && <h3 className="text-xl font-semibold">Cart</h3>}
        {activeTab === 'settings' && <h3 className="text-xl font-semibold">Settings</h3> }
      </div>
    </div>
  );
}