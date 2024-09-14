import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    console.log(`Book ID clicked: ${book._id}`); 
    navigate(`/get-book-details/${book._id}`);
  };
  return (
   
    <div
      className="relative w-72 h-[34rem] flex flex-col items-center overflow-hidden bg-white border border-gray-300 shadow-md
                 transition-transform duration-300 ease-in-out hover:scale-105"
      onClick={handleClick}
    >
      
      <div className="bg-white overflow-hidden rounded-t-lg">
        <img
          src={book.url}
          alt={book.title}
          className="mt-6 w-3/10 h-full object-contain"
        />
      </div>

     
      <div className="p-4 flex flex-col h-1/3">
        <h3 className="text-lg font-semibold mb-1 truncate">{book.title}</h3>
        <p className="text-gray-700 italic mb-1 truncate">By {book.author}</p>
        <p className="text-gray-600">{book.price ? `$${book.price}` : 'Price not available'}</p>
      </div>
    </div>
  );
};

export default BookCard;
