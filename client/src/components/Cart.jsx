import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedForLater, setSavedForLater] = useState([]); 

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCartBooks = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/auth/get-cart-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart info');
        }

        const data = await response.json();

        if (Array.isArray(data.cart)) {
          const cartWithDefaults = data.cart.map((book) => ({
            ...book,
            price: book.price || 0,
            quantity: book.quantity || 1,
          }));

          setCartBooks(cartWithDefaults);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartBooks();
  }, [token]);

  const handleQuantityChange = (bookId, delta) => {
    setCartBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === bookId
          ? { ...book, quantity: Math.max(1, book.quantity + delta) }
          : book
      )
    );
  };

  const finalTotal = cartBooks.reduce((total, book) => {
    const price = book.price || 0;
    const quantity = book.quantity || 1;
    return total + price * quantity;
  }, 0);

  const handleRemove = (bookId) => {
    setCartBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
  };

  const handleSaveForLater = (bookId) => {
    const bookToSave = cartBooks.find((book) => book._id === bookId);
    if (bookToSave) {
      setSavedForLater((prevSaved) => [...prevSaved, bookToSave]);
      handleRemove(bookId);
    }
  };

  const moveToCart = (bookId) => {
    const bookToMove = savedForLater.find((book) => book._id === bookId);
    if (bookToMove) {
      setCartBooks((prevCartBooks) => [...prevCartBooks, bookToMove]);
      setSavedForLater((prevSaved) => prevSaved.filter((book) => book._id !== bookId));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="flex p-8">
      <div className="w-3/5 pr-6">
        <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>
        {cartBooks.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartBooks.map((book) => (
              <div key={book._id} className="bg-white p-4 rounded shadow-md flex flex-col h-65">
                <div className="flex items-start">
                  <img
                    src={book.url}
                    alt={book.title}
                    className="w-32 h-30 object-cover mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold">{book.title}</h2>
                    <p className="text-gray-700">By {book.author}</p>
                    <p className="text-gray-600 mt-2">${book.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end ml-4">
                    <div className="flex items-center mb-4">
                      <button
                        onClick={() => handleQuantityChange(book._id, -1)}
                        className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 mt-20"
                        disabled={book.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2 mt-20">{book.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(book._id, 1)}
                        className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 mt-20"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRemove(book._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleSaveForLater(book._id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      >
                        Save for Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {savedForLater.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Saved for Later</h2>
            <div className="space-y-6">
              {savedForLater.map((book) => (
                <div key={book._id} className="flex items-center bg-white p-4 rounded shadow-md h-48">
                  <img
                    src={book.url}
                    alt={book.title}
                    className="w-32 h-40 object-cover mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold">{book.title}</h2>
                    <p className="text-gray-700">By {book.author}</p>
                    <p className="text-gray-600 mt-2">${book.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => moveToCart(book._id)}
                    className="ml-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Move to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-1/3 pl-6 border-l border-gray-300">
        <h2 className="text-2xl font-semibold mb-4">Bill Summary</h2>
        <div className="bg-white p-4 rounded shadow-md">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Total Items:</span>
            <span>{cartBooks.reduce((total, book) => total + book.quantity, 0)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total Price:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
