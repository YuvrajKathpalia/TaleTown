import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import loader from '../assets/images/loader.gif'; 

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
    <div className="p-8">
      <h2 className="text-3xl font-bold ">{book.title}</h2>
      <div className="ml-12">
        <p>Author {book.author}</p>
        <p>Price: {book.price ? `$${book.price}` : 'Price not available'}</p>
        <p>Description {book.description}</p>
        <img src={book.url} alt={book.title} />
      </div>
    </div>
  );
};

export default BookDetails;
