import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/images/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FaUser } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderHistory, setOrderHistory] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem('token'); 

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        const userResponse = await fetch('http://localhost:2000/api/auth/get-user-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const fetchFavorites = async () => {
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const favoriteResponse = await fetch('http://localhost:2000/api/auth/get-favourite-books', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (favoriteResponse.status === 403) {
        throw new Error('Session expired. Please log in again.');
      }

      if (!favoriteResponse.ok) throw new Error('Failed to fetch favorite books');

      const favoriteData = await favoriteResponse.json();
      setFavorites(favoriteData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError(error.message);
    }
  };

  const fetchCartBooks = async () => {
    if (!token) {
      navigate('/signin');
      return;
    }

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
        setCartItems(cartWithDefaults);
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

  

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/auth/order-history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
  
      const data = await response.json();
      console.log('Fetched order history:', data); 
      setOrderHistory(data.data); 
    } catch (error) {
      console.error('Error fetching order history:', error);
      setError(error.message);
    }
  };

//admin 
  const fetchAllOrders = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/auth/get-all-orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch all orders');
      }
  
      const data = await response.json();
      console.log('Fetched all orders:', data); 
  
      setOrderHistory(data.data); 
      console.log('Order history :', data.data); 
    } catch (error) {
      console.error('Error fetching all orders:', error);
      setError(error.message);
    }
  }; 
  
 
  useEffect(() => {
    if (activeTab === 'seeingOrders') {
      fetchAllOrders(); // admin
    } else if (activeTab === 'orders') {
      fetchOrderHistory(); // user
    } else {
      fetchFavorites();
      fetchCartBooks();
    }
  }, [activeTab, token]);

  
  const handleQuantityChange = async (bookId, delta) => {
    const updatedBookIndex = cartItems.findIndex((book) => book.book && book.book._id.toString() === bookId);

    if (updatedBookIndex === -1) {
      console.error('Book not found in cart');
      return;
    }

    const updatedBook = cartItems[updatedBookIndex];
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

      setCartItems((prevBooks) =>
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

  const handleRemoveFromFavorites = async (bookId) => {
    console.log(`Attempting to remove book with ID: ${bookId} from favorites`);
  
    try {
      const response = await fetch(`http://localhost:2000/api/auth/remove-from-favourites/${bookId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(`Failed to remove item from favorites: ${errorData.msg}`);
      }
  
      const data = await response.json(); 
      console.log(`Removed book with ID: ${bookId} from favorites`, data);
  
      setFavorites((prevFavorites) =>
        prevFavorites.filter((book) => book._id.toString() !== bookId)
      );
    } catch (error) {
      console.error('Error removing item from favorites:', error);
      setError(error.message); 
    }
  };
  
  const handleRemoveFromCart = async (bookId) => {
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

      setCartItems((prevBooks) =>
        prevBooks.filter((book) => book.book._id.toString() !== bookId)
      );
      console.log(`Removed book with ID: ${bookId}`);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError(error.message);
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to your cart before placing an order.');
      return;
    }
  
    const orderData = {
      orders: cartItems.map((item) => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.price,
      })),
      total: getTotalAmount(),
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
  
      const data = await response.json();
      console.log('Order placed successfully:', data);
  
      alert('Order placed successfully!');
      setCartItems([]); // Clear frontend cart state..
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message);
    }
  };
  

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:2000/api/auth/update-status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.status === 'Success') {
        setOrderHistory((prevHistory) =>
          prevHistory.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        console.log('Order status updated:', data.data);
      } else {
        console.error('Error updating status:', data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user); 
  };

  const closeDetails = () => {
    setSelectedUser(null); 
  };

  
    return (
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-lg p-6 mt-10 ml-10 flex flex-col items-center h-fit">
          <div className="text-center mb-8">
            <img src={avatar} alt="Avatar" className="w-20 h-20 rounded-full mb-4" />
            <h2 className="text-xl font-semibold">{user.username}</h2>
          </div>
  
          {user.role === 'admin' ? (
            <>
              <button onClick={() => setActiveTab('addBook')} className={`w-full text-left px-4 py-2 mb-4 ${activeTab === 'addBook' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'} hover:bg-blue-50 rounded`}>
                Add Book
              </button>
              <button onClick={() => setActiveTab('seeingOrders')} className={`w-full text-left px-4 py-2 mb-4 ${activeTab === 'seeingOrders' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'} hover:bg-blue-50 rounded`}>
                Seeing Orders
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('favorites')} className={`w-full text-left px-4 py-2 mb-4 ${activeTab === 'favorites' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'} hover:bg-blue-50 rounded`}>
                Favorites
              </button>
              <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-2 mb-4 ${activeTab === 'orders' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'} hover:bg-blue-50 rounded`}>
                Orders
              </button>
              <button onClick={() => setActiveTab('cart')} className={`w-full text-left px-4 py-2 mb-4 ${activeTab === 'cart' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'} hover:bg-blue-50 rounded`}>
                Cart
              </button>
              <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-2 ${activeTab === 'settings' ? 'bg-blue-100 text-blue-800' : 'text-gray-700'} hover:bg-blue-50 rounded`}>
                Settings
              </button>
            </>
          )}
  
          <button onClick={handleLogout} className="mt-4 w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 rounded">
            <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
            Logout
          </button>
        </div>
  
        {/* Main Content */}
        <div className="flex-grow p-6 mt-10">
      
      
          {activeTab === 'favorites' && (
            <div className="min-h-screen bg-white py-8 px-12">
              <div className="grid gap-16 grid-cols-1 lg:grid-cols-3 justify-items-center">
                {favorites.map((book) => (
                  <Link
                    key={book._id}
                    to={`/get-book-details/${book._id}`}
                    className="relative w-56 h-[19rem] flex flex-col items-center overflow-hidden bg-white border border-gray-300 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
                  >
                    <div className="bg-white overflow-hidden rounded-t-lg">
                      <img
                        src={book.url}
                        alt={book.title}
                        className="mt-4 w-full h-48 object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{book.title}</h3>
                      <p className="text-sm text-gray-600">By {book.author}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFromFavorites(book._id);
                      }}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faHeart} className="text-2xl" />
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          )}
  
        
          {activeTab === 'cart' && (
            <div className="min-h-screen bg-white py-8 px-12">
              <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
              {cartItems.length === 0 ? (
                <p className="text-gray-600 text-lg">Your cart is empty.</p>
              ) : (
                <div className="grid gap-6">
                  {cartItems.map((item) => (
                    <div key={item.book._id} className="flex flex-col lg:flex-row justify-between items-center bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                      <Link to={`/get-book-details/${item.book._id}`} className="flex items-center w-full lg:w-auto mb-4 lg:mb-0">
                        <img
                          src={item.book.url}
                          alt={item.book.title}
                          className="w-20 h-28 object-cover rounded-md mr-4"
                        />
                        <div className="ml-4 text-left">
                          <h3 className="text-lg font-semibold">{item.book.title}</h3>
                          <p className="text-sm text-gray-500">By {item.book.author}</p>
                          <p className="text-sm text-gray-500 mt-1">Price: ${item.price}</p>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between w-full lg:w-auto lg:ml-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.book._id, -1)}
                            className="bg-gray-200 text-gray-800 p-2 rounded-lg"
                            disabled={item.quantity === 1}
                          >
                            -
                          </button>
                          <span className="mx-4 text-lg">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.book._id, 1)}
                            className="bg-gray-200 text-gray-800 p-2 rounded-lg"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.book._id)}
                          className="ml-4 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col lg:flex-row justify-between items-center mt-8 border-t border-gray-300 pt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="text-lg font-semibold text-gray-800 mb-4 lg:mb-0">
                      <span className="text-gray-600">Total Quantity:</span> {getTotalQuantity()}
                    </div>
                    <div className="text-xl font-bold text-gray-800">
                      Total Amount: <span className="text-blue-600">${getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          )}
  
          {activeTab === 'orders' && (
            <div className="min-h-screen bg-white py-8 px-12">
              <h2 className="text-3xl font-bold mb-6">Order History</h2>
              {orderHistory.length === 0 ? (
                <p className="text-gray-600 text-lg">You have no orders yet.</p>
              ) : (
                <div>
                  {orderHistory.map((order) => (
                    <div key={order._id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                      <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <h4 className="text-md font-bold mt-2">Items:</h4>
                      {order.items.map((item) => (
                        <div key={item.book._id} className="flex justify-between items-center mb-2">
                          <span>{item.book.title} (x{item.quantity})</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="text-xl font-bold">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
  
          {/* settings */}
          {activeTab === 'settings' && (
            <div className="min-h-screen bg-white py-8 px-12">
              <h3 className="text-xl font-semibold">Settings</h3>
    
            </div>
          )}
  
          {/* manage order..admin*/}

          {activeTab === 'seeingOrders' && (
  <div className="min-h-screen bg-gray-100 py-8 px-6 lg:px-12">
    <h2 className="text-5xl font-semibold text-gray-500 mb-8 text-center text-gray-800 ml-15">All Orders</h2>
    {orderHistory.length === 0 ? (
      <p className="text-gray-600 text-lg text-center">No orders found.</p>
    ) : (
      <div className="space-y-6">
        {orderHistory.map((order) => {
          const totalAmount = order.orders.reduce((total, item) => total + (item.price * item.quantity), 0);
          const statusColor = order.status === 'Cancelled' ? 'text-red-600' : order.status === 'Order Placed' ? 'text-orange-600' : 'text-green-600';

          return (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order placed by <span className="text-blue-600">{order.user.username}</span>
                </h3>
                <FaUser
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  onClick={() => handleUserClick(order.user)}
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <span className={statusColor}>Status: {order.status}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>

              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-300">Book Title</th>
                    <th className="p-2 border border-gray-300">Author</th>
                    <th className="p-2 border border-gray-300">Price</th>
                    <th className="p-2 border border-gray-300">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orders.map((item) => (
                    <tr key={item.book._id}>
                      <td className="p-2 border border-gray-300">{item.book.title}</td>
                      <td className="p-2 border border-gray-300">{item.book.author}</td>
                      <td className="p-2 border border-gray-300">${item.price.toFixed(2)}</td>
                      <td className="p-2 border border-gray-300">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-lg font-semibold mt-4 text-gray-800">
                Total Amount: <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
              </p>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor={`status-${order._id}`}>
                  Change Status:
                </label>
                <select
                  id={`status-${order._id}`}
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={order.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    handleStatusChange(order._id, newStatus);
                  }}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    )}

    {selectedUser && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h3 className="text-lg font-semibold mb-2">User Details</h3>
          <p className="text-sm text-gray-800">Username: <span className="font-semibold">{selectedUser.username}</span></p>
          <p className="text-sm text-gray-800">Email: <span className="font-semibold">{selectedUser.email}</span></p>
          <p className="text-sm text-gray-800">Address: <span className="font-semibold">{selectedUser.address}</span></p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={closeDetails}
          >
            Close
          </button>
        </div>
      </div>
    )}
  </div>
)}

          {/* add books.. */}
          {activeTab === 'addBook' && (
            <div>
              <h1 className="text-3xl font-bold mb-6">Add a New Book</h1>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default Profile;
  