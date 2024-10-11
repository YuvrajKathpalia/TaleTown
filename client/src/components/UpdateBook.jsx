import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const UpdateBook = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  const { book } = location.state || {}; 

  const [newBook, setNewBook] = useState({
    title: book?.title || '',
    author: book?.author || '',
    price: book?.price || '',
    description: book?.description || '',
    language: book?.language || '',
    url: book?.url || '',
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:2000/api/auth/update-book/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      alert('Book updated successfully!');
      navigate('/books');
    } catch (error) {
      console.error('Error updating book:', error);
      setError('Failed to update book.'); 
    }
  };

  return (
    <div className="w-full p-8 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center text-indigo-900 mb-6">Update Book</h1>
      <form onSubmit={handleFormSubmit} className="space-y-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-6 items-center">
          <label className="text-lg font-medium text-purple-800">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter book title"
            value={newBook.title}
            onChange={handleInputChange}
            className="col-span-2 p-4 border border-purple-300 rounded-lg bg-purple-50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-6 items-center">
          <label className="text-lg font-medium text-blue-800">Author</label>
          <input
            type="text"
            name="author"
            placeholder="Enter author name"
            value={newBook.author}
            onChange={handleInputChange}
            className="col-span-2 p-4 border border-blue-300 rounded-lg bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-6 items-center">
          <label className="text-lg font-medium text-indigo-800">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Enter book price"
            value={newBook.price}
            onChange={handleInputChange}
            className="col-span-2 p-4 border border-indigo-300 rounded-lg bg-indigo-50 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-6 items-center ">
          <label className="text-lg font-medium text-purple-800">Description</label>
          <textarea
            name="description"
            placeholder="Enter book description"
            value={newBook.description}
            onChange={handleInputChange}
            className="col-span-2 p-4 border border-purple-300 rounded-lg bg-purple-50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-6 items-center">
          <label className="text-lg font-medium text-blue-800">Language</label>
          <input
            type="text"
            name="language"
            placeholder="Enter book language"
            value={newBook.language}
            onChange={handleInputChange}
            className="col-span-2 p-4 border border-blue-300 rounded-lg bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-6 items-center">
          <label className="text-lg font-medium text-indigo-800">Image URL</label>
          <input
            type="text"
            name="url"
            placeholder="Enter image URL"
            value={newBook.url}
            onChange={handleInputChange}
            className="col-span-2 p-4 border border-indigo-300 rounded-lg bg-indigo-50 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            required
          />
        </div>
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow hover:bg-gradient-to-l transition duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Update Book
          </button>
        </div>
      </form>
      {error && <p className="mt-6 text-red-500 text-center">{error}</p>}
    </div>
  );      
};      

export default UpdateBook;
