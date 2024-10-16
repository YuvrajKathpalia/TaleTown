import React, { useEffect, useState } from 'react';
import BookCard from '../components/BookCard'; 
import loader from '../assets/images/loader.gif'; 

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/auth/get-all-books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error retrieving books:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-200 flex flex-col">

      {loading && (
        <div className="flex items-center justify-center flex-grow">
          <img src={loader} alt="Loading..." className="w-16 h-16" />
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <h2 className="text-2xl font-bold text-red-500">Failed to load books. Please try again later.</h2>
        </div>
      )}

      {!loading && !error && (
        <div className="flex-grow">
          <div className="ml-12 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {books.length > 0 ? (
              books.map(book => (
                <BookCard key={book._id} book={book} />
              ))
            ) : (
              <p className="text-xl text-gray-500">No books available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;

