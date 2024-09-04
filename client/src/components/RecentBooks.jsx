import React, { useEffect, useState } from 'react';
import BookCard from '../components/BookCard'; 

const RecentBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/auth/get-recent-books');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching recent books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-500 ml-5">Recently Added Books</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {books.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default RecentBooks;
