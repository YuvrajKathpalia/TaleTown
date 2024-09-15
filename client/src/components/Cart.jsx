import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          setCartBooks(data.cart); 
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      {cartBooks.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartBooks.map((book) => (
            <div key={book._id}>
              <img
                src={book.url}
                alt={book.title}
              />
              <h2>{book.title}</h2>
              <p>By {book.author}</p>
              <p>{book.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
