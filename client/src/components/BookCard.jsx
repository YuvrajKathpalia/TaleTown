import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    console.log(`Book ID clicked: ${book._id}`); 
    navigate(`/get-book-details/${book._id}`);
  };
  return (
    <div
      className="relative w-[16rem] h-[22rem] flex flex-col items-center overflow-hidden bg-white border border-gray-300 shadow-md rounded-lg transition-transform duration-300 ease-in-out cursor-pointer hover:scale-105"
      onClick={handleClick}
      style={{ boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)', transition: 'box-shadow 0.3s ease' }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)')}
    >
      <div className="rounded-t-lg mt-2"> 
        <img
          src={book.url}
          alt={book.title}
          className="mt-6 w-full h-48 object-contain transition-transform duration-300 ease-in-out hover:scale-110"
        />
      </div>
  
      <div className="p-4 flex flex-col h-1/3">
        <h3 className="text-2xl font-afacadFlux font-semibold mb-1 truncate transition-colors duration-300 ease-in-out hover:text-purple-500">{book.title}</h3>
        <p className="text-gray-700 italic mb-1 truncate transition-colors duration-300 ease-in-out hover:text-purple-400">By {book.author}</p>
        <p className="text-gray-600 font-medium transition-colors duration-300 ease-in-out hover:text-gray-800">{book.price ? `$${book.price}` : 'Price not available'}</p>
      </div>
    </div>
  );
  
};

export default BookCard;
