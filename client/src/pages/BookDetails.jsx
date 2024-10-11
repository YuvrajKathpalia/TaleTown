import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import loader from '../assets/images/loader.gif'; 
import { FaGlobe } from 'react-icons/fa';
import { FaEdit, FaTrash  } from 'react-icons/fa'; 



const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 

  const [book, setBook] = useState({
    id: id,
    url: '',
    title: '',
    author: '',
    price: '',
    description: '',
    language: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [isFavorited, setIsFavorited] = useState(false); 
  const [isInCart, setIsInCart] = useState(false); 
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); 

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:2000/api/auth/get-book/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        setBook(data);
        setIsFavorited(data.isFavorited); 
        setIsInCart(data.isInCart);
      } catch (error) {
        console.error('Error retrieving the book:', error);
        setError(error.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]); 

  const handleAddToFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:2000/api/auth/add-to-favourites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 400) {
        alert('Book already in favorites');
        return; 
      }

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }

      alert('Book added to favorites!'); 
      setIsFavorited(true); 
    } 
    catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites.');
    }
  };
  
  const handleAddToCart = async () => {
    try {
      const response = await fetch(`http://localhost:2000/api/auth/add-to-cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 400) {
        alert('Book already in cart');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      alert('Book added to cart!');
      setIsInCart(true);
      navigate('/cart'); 
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart.');
    }
  };

  const handleUpdateBook = () => {
    navigate(`/update-book/${id}`, { state: { book } });
  };

  const handleDeleteBook = async () => {
    try {
      const response = await fetch(`http://localhost:2000/api/auth/delete-book/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      alert('Book deleted successfully!');
      navigate('/books'); 
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <img src={loader} alt="Loading..." className="w-16 h-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <h2 className="text-2xl font-semibold text-red-500">{error}</h2>
      </div>
    );
  }

    return (
      <div className="h-[calc(100vh-60px)] w-screen bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 flex gap-12 p-12 items-center justify-center">
        <div className="flex-shrink-0">
          <img
            src={book.url}
            alt={book.title}
            className="w-[260px] h-[380px] object-contain" 
          />
        </div>
    
        <div className="w-2/5 mt-[-50px]">
          <h1 className="text-5xl font-bold text-black font-serif mb-4">{book.title}</h1> 
          <p className="text-xl text-black-200 italic mb-6 font-merriweatherSans">By {book.author}</p> 
          <p className="text-lg text-balck200 mb-8 font-sans">{book.description || 'No description available.'}</p> 
    
          <div className="flex items-center gap-2 mt-4">
            <FaGlobe className="text-black-200" /> 
            <p className="text-lg text-black-200">{book.language || 'Language not specified'}</p>
          </div>
          
          <p className="mt-4 text-3xl font-semibold text-black-100">
            Price: {book.price ? `$${book.price}` : 'Price not available'}
          </p>
    
          <div className="flex gap-4 mt-9">
            {userRole === 'admin' ? (
              <>
                <button
                  onClick={handleUpdateBook}
                  className="bg-black text-white py-2 px-6 rounded hover:bg-blue-700 w-56 flex items-center gap-2"
                >
                  <FaEdit /> Update Book
                </button>
                <button
                  onClick={handleDeleteBook}
                  className="bg-black text-white py-2 px-6 rounded hover:bg-red-700 w-56 flex items-center gap-2"
                >
                  <FaTrash /> Delete Book
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAddToFavorites}
                  className="bg-black text-white py-2 px-6 rounded hover:bg-red-700 w-56"
                >
                 Add to Favorites
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white py-2 px-6 rounded hover:bg-blue-700 w-56"
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );    
};

export default BookDetails;
