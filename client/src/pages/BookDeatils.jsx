import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import loader from '../assets/images/loader.gif'; 
import { FaGlobe } from 'react-icons/fa';

const BookDetails = () => {
  const { id } = useParams(); 
  console.log(id);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:2000/api/auth/get-book/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error('Error retrieving the book:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]); //refetch when id changes..

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
        <h2 className="text-2xl font-semibold text-red-500">Failed to load book details. Please try again later.</h2>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-60px)] w-screen bg-white flex gap-12 p-12 items-center justify-center">
      
      <div className="flex-shrink-0">
        <img
          src={book.url}
          alt={book.title}
          className="w-[260px] h-[380px] object-contain" 
        />
      </div>

    {/* book details... */}
      <div className="w-2/5 mt-[-50px]">
        <h1 className="text-5xl font-bold text-black font-serif mb-4">{book.title}</h1> 
        <p className="text-xl text-gray-800 italic mb-6 font-merriweatherSans">By {book.author}</p> 
        
        <p className="text-lg text-gray-600 mb-8 font-sans">{book.description || 'No description available.'}</p> 

        <div className="flex items-center gap-2 mt-4">
          <FaGlobe className="text-gray-600" /> 
          <p className="text-lg text-gray-600">{book.language || 'Language not specified'}</p>
        </div>
        
        <p className="mt-4 text-3xl font-semibold text-gray-800">
          Price: {book.price ? `$${book.price}` : 'Price not available'}
        </p>
      </div>
    </div>
  );
};

export default BookDetails;
