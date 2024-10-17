  import React, { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import loader from '../assets/images/loader.gif'; 

  const Cart = () => {
    const [cartBooks, setCartBooks] = useState([]);
    const [savedBooks, setSavedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
      if (!token) {
        navigate('/signin');
        return;
      }

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
          console.log('Fetched cart data:', data);

          if (Array.isArray(data.cart)) {
            const cartWithDefaults = data.cart
              .filter((item) => item.book)
              .map((item) => ({
                ...item,
                price: item.book.price,
                quantity: item.quantity || 1,
              }));
            setCartBooks(cartWithDefaults);
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchSavedBooks = async () => {
        try {
          const response = await fetch('http://localhost:2000/api/auth/get-saved-books', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch saved books');
          }

          const data = await response.json();
          setSavedBooks(data.savedBooks || []);
        } catch (error) {
          console.error('Error fetching saved books:', error);
          setError(error.message);
        }
      };

      fetchCartBooks();
      fetchSavedBooks();
    }, [token, navigate]);

    const handleQuantityChange = async (bookId, delta) => {
      const updatedBookIndex = cartBooks.findIndex((book) => book.book && book.book._id.toString() === bookId);
      
      if (updatedBookIndex === -1) {
        console.error('Book not found in cart');
        return;
      }
    
      const updatedBook = cartBooks[updatedBookIndex];
      const newQuantity = Math.max(1, updatedBook.quantity + delta);
      
      console.log(`Updating quantity for book ${bookId}: ${newQuantity}`);
    
      try {
        const response = await fetch(`http://localhost:2000/api/auth/update-cart/${bookId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to update cart');
        }
    
        const data = await response.json();
        console.log('Updated cart data:', data);
    
        setCartBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.book._id.toString() === bookId
              ? { ...book, quantity: newQuantity }
              : book
          )
        );
        
      } catch (error) {
        console.error('Error updating cart:', error);
        setError(error.message);
      }
    };

    const handleRemove = async (bookId) => {
      console.log(`Attempting to remove book with ID: ${bookId}`);
      try {
        const response = await fetch(`http://localhost:2000/api/auth/remove-from-cart/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to remove item from cart: ${errorData.msg}`);
        }

        setCartBooks((prevBooks) =>
          prevBooks.filter((book) => book.book._id.toString() !== bookId)
        );
        console.log(`Removed book with ID: ${bookId}`);
      } catch (error) {
        console.error('Error removing item from cart:', error);
        setError(error.message);
      }
    };


    const handlePlaceOrder = async () => {
      // Check if the cart is empty
      if (cartBooks.length === 0) {
          alert('Your cart is empty. Please add items to your cart before placing an order.');
          return;
      }
  
      if (!token) {
          alert('You need to be logged in to place an order.');
          return;
      }
  
      // Create order data with calculated total
      const totalAmount = Math.round(getTotalAmount() * 100); // Total in paise
      const orderData = {
          orders: cartBooks.map((item) => ({
              book: item.book._id,
              quantity: item.quantity,
              price: item.price,
          })),
          total: totalAmount, 
      };
  
      try {      
          const response = await fetch('http://localhost:2000/api/auth/place-order', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(orderData),
          });
  
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Failed to place order: ${errorData.message}`);
          }
  
          const order = await response.json(); 
          console.log('Order placed successfully:', order);
  
          // Razorpay options.
          const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY, 
              amount: order.total, 
              currency: 'INR',
              name: 'TaleTown',
              description: 'Purchase of books',
              order_id: order.razorpayOrderId, // Razorpay order ID received from the backend..
              handler: async function (response) {
                  console.log('Payment response:', response); // Log the payment response..
  
                  // Handle successful payment verification
                  try {
                      // Fetch the validation response..
                      const validateRes = await fetch('http://localhost:2000/api/auth/validate-order', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                              razorpay_order_id: response.razorpay_order_id,
                              razorpay_payment_id: response.razorpay_payment_id,
                              razorpay_signature: response.razorpay_signature,
                          }),
                      });
  
                      if (!validateRes.ok) {
                          const errorData = await validateRes.json();
                          throw new Error(`Payment verification failed: ${errorData.message}`);
                      }
  
                      const result = await validateRes.json();
                      console.log('Payment verification result:', result);
  
                      if (result.msg === 'success') {
                          alert('Payment Successful!');
  
                          // Clear cart from the backend after placing the order
                          const clearResponse = await fetch('http://localhost:2000/api/auth/clear-cart', {
                              method: 'DELETE',
                              headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`,
                              },
                          });
  
                          if (!clearResponse.ok) {
                              const errorData = await clearResponse.json();
                              throw new Error(`Failed to clear cart: ${errorData.message}`);
                          }
  
                          const clearCartResult = await clearResponse.json();
                          console.log('Cart cleared:', clearCartResult);
  
                        
                          setCartBooks([]);  //also manage state on frontend
                      }
                  } catch (error) {
                      console.error('Error in payment verification:', error);
                      alert('An error occurred during payment verification. Please try again.');
                  }
              },
              prefill: {
                  name: 'user',
                  email: 'user@example.com',
                  contact: '9999999999',
              },
              theme: {
                  color: '#9d66f0',
              },
          };
  
          // Create a new Razorpay instance and open the payment modal
          const razorpay = new window.Razorpay(options);
          razorpay.open();
      } catch (error) {
          console.error('Error placing order:', error);
          alert(error.message); 
      }
  };


    const handleSaveForLater = async (bookId) => {
      const bookToSave = cartBooks.find((book) => book.book._id === bookId);
      if (bookToSave) {
          try {
              await fetch(`http://localhost:2000/api/auth/save-for-later/${bookId}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                  },
              });

              setCartBooks((prev) => prev.filter((book) => book.book._id !== bookId));
              setSavedBooks((prev) => {
                  const isAlreadySaved = prev.some((savedBook) => savedBook.book._id === bookId);
                  return isAlreadySaved ? prev : [...prev, bookToSave]; 
              });
          } catch (error) {
              console.error('Error saving book for later:', error);
              setError(error.message);
          }
      }
  };

  const handleMoveToCart = async (bookId) => {
    const bookToMove = savedBooks.find((book) => book.book._id === bookId);
    if (bookToMove) {
        try {
            await fetch(`http://localhost:2000/api/auth/move-to-cart/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setSavedBooks((prev) => prev.filter((book) => book.book._id !== bookId));
            setCartBooks((prev) => {
                const isAlreadyInCart = prev.some((cartBook) => cartBook.book._id === bookId);
                return isAlreadyInCart
                    ? prev.map((cartBook) =>
                        cartBook.book._id === bookId
                            ? { ...cartBook, quantity: cartBook.quantity + 1 }
                            : cartBook
                    )
                    : [...prev, { ...bookToMove, quantity: 1 }];
            });
        } catch (error) {
            console.error('Error moving book to cart:', error);
            setError(error.message);
        }
    }
  };



  const getTotalAmount = () => {
    return cartBooks.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const getTotalQuantity = () => {
      return cartBooks.reduce((total, item) => total + item.quantity, 0);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 flex items-center justify-center">
        <img src={loader} alt="Loading..." className="w-16 h-16" /> 
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 flex items-center justify-center text-red-700 font-bold text-2xl">
        Error: {error}
      </div>
    );
  }


    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 p-8">
        <div className="flex">
          <div className="w-3/5 pr-6">
            <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>
            {cartBooks.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="space-y-6">
                {cartBooks.map((item) => {
                  const book = item.book;
                  return (
                    <div key={item._id} className="bg-white p-4 rounded shadow-md flex flex-col h-65">
                      {book ? (
                        <div className="flex items-start">
                          <img
                            src={book.url}
                            alt={book.title}
                            className="w-32 h-30 object-cover mr-3"
                          />
                          <div className="flex-grow">
                            <h2 className="text-xl font-bold">{book.title}</h2>
                            <p className="text-gray-700">By {book.author}</p>
                            <p className="text-gray-600 mt-2">${(book.price || 0).toFixed(2)}</p>
                            <div className="flex items-center mt-4">
                              <button onClick={() => handleQuantityChange(book._id, -1)} className="bg-gray-200 px-2 py-1 rounded">-</button>
                              <span className="mx-2">{item.quantity}</span>
                              <button onClick={() => handleQuantityChange(book._id, 1)} className="bg-gray-200 px-2 py-1 rounded">+</button>
                            </div>
                            <div className="flex mt-4 space-x-2">
                              <button onClick={() => handleRemove(book._id)} className="bg-red-500 text-white px-4 py-1 rounded">Remove</button>
                              <button onClick={() => handleSaveForLater(book._id)} className="bg-teal-600 text-white px-4 py-1 rounded">Save for Later</button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
  
            {savedBooks.length > 0 && (
              <div className="mt-8">
                <h1 className="text-3xl font-semibold mb-6">Saved for Later</h1>
                <div className="space-y-6">
                  {savedBooks.map((item) => {
                    const book = item.book;
                    return (
                      <div key={item._id} className="bg-white p-4 rounded shadow-md flex flex-col">
                        {book ? (
                          <div className="flex items-start">
                            <img
                              src={book.url}
                              alt={book.title}
                              className="w-32 h-30 object-cover mr-4"
                            />
                            <div className="flex-grow">
                              <h2 className="text-xl font-bold">{book.title}</h2>
                              <p className="text-gray-700">By {book.author}</p>
                              <p className="text-gray-600 mt-2">${(book.price || 0).toFixed(2)}</p>
                              <button onClick={() => handleMoveToCart(book._id)} className="bg-orange-500 text-white px-4 py-1 rounded mt-6">Move to Cart</button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="w-2/5">
            <h1 className="text-3xl font-semibold mb-6">Order Summary</h1>
            <div className="bg-white p-4 rounded shadow-md">
              <div className="border-b pb-2 mb-2">
                <h2 className="text-xl font-semibold mb-4">Items</h2>
                <div className="flex justify-between mb-2">
                  <span>Total Items:</span>
                  <span>{getTotalQuantity()}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total Amount:</span>
                <span>${getTotalAmount().toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
                disabled={cartBooks.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
  );
  };

  export default Cart;

