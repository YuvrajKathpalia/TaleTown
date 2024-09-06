import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    console.log(`Book ID clicked: ${book._id}`); 
    navigate(`/get-book-details/${book._id}`);
  };
  return (
   
    <div className="relative w-80 h-30 flex flex-col items-center overflow-hidden m-0 pt-8 bg-white border border-gray-300
                    transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg"
                    onClick={handleClick}>
\
    <div className="w-full h-48 bg-gray-100 overflow-hidden rounded-t-lg ">
      <img
        src={book.url} 
        alt={book.title}
        className="w-full h-48 object-cover"
      />
       </div>
      <div className="p-4">
        <h3 className="text-2xl font-semibold mb-2">{book.title}</h3>
        <p className="text-gray-700 font-merriweatherSans italic mb-2">By {book.author}</p>
        <p className="text-gray-600 font-merriweatherSans mb-2">{book.price ? `$${book.price}` : 'Price not available'}</p>
      </div>
    </div>

  );
};

export default BookCard;
