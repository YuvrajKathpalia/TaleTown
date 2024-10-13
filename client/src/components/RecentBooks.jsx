import React, { useEffect, useState } from 'react';
import BookCard from '../components/BookCard'; 
import loader from '../assets/images/loader.gif'

const RecentBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/auth/get-recent-books');

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching recent books:', error);
        setError(true);
      }
      finally {
        setLoading(false); 
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="p-8">
      
      <div className="flex justify-center mb-12">
        <img 
          src="https://see.fontimg.com/api/rf5/BOrl/YTdkZTNkMmNlM2I1NDc5Y2EyM2YzMGZhZjRmYTUzNDQudHRm/TmV3IEFycml2YWxz/kg-ten-thousand-reasons-alt.png?r=fs&h=81&w=1250&fg=000000&bg=FFFFFF&s=65"
          alt="New Arrivals" 
          className="w-[25rem] h-[5rem]" 
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <img src={loader} alt="Loading..." className="w-16 h-16" />
        </div>
      )}

      {/* Error Handling */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <h2 className="text-2xl font-semibold text-red-500">Failed to load recent books. Please try again later.</h2>
        </div>
      )}
       {!loading && !error && (
      <div className="ml-12 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.slice(0, 4).map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    )}
    </div>
  );
};

export default RecentBooks;
