import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/auth/get-favourite-books', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorite books');
        }

        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching favorite books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  const handleRemoveFromFavorites = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:2000/api/auth/remove-from-favourites/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to remove item from favorites: ${errorData.msg}`);
      }

      setFavorites((prevFavorites) =>
        prevFavorites.filter((book) => book._id.toString() !== bookId)
      );
    } catch (error) {
      console.error('Error removing item from favorites:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white py-8 px-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Favorite Books Await!</h1>
        <p className="text-lg text-gray-600">Explore your collection of favorite books.</p>
      </div>
      
      <div className="grid gap-16 grid-cols-auto-fit sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
        {favorites.map((book) => (
          <div key={book._id} className="relative w-72 h-[22rem] flex flex-col items-center overflow-hidden bg-white border border-gray-300 shadow-md transition-transform duration-300 ease-in-out hover:scale-105">
            <Link
              to={`/get-book-details/${book._id}`}
              className="bg-white overflow-hidden rounded-t-lg flex-grow"
            >
              <img
                src={book.url}
                alt={book.title}
                className="mt-6 w-full h-48 object-contain"
              />
              <div className="p-4 flex flex-col h-1/3">
                <h3 className="text-lg font-semibold mb-1 truncate">{book.title}</h3>
                <p className="text-gray-700 italic mb-1 truncate">By {book.author}</p>
                <p className="text-gray-600">{book.price ? `$${book.price}` : 'Price not available'}</p>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFromFavorites(book._id);
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FontAwesomeIcon icon={faHeart} className="text-2xl" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
