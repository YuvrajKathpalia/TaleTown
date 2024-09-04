import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
      <img
        src={book.url} 
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-2xl font-semibold mb-2">{book.title}</h3>
        <p className="text-gray-700 mb-2">By {book.author}</p>
        <p className="text-gray-600 mb-2">{book.price ? `$${book.price}` : 'Price not available'}</p>
      </div>
    </div>
  );
};

export default BookCard;
