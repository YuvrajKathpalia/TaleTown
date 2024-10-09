import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Books from './pages/Books';
import Favorites from './pages/Favorites';
import Cart from './components/Cart';
import SignIn from './pages/SignIn'; 
import SignUp from './pages/Signup';
import Profile from './pages/Profile';
import BookDeatils from './pages/BookDetails';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/books" element={<Books />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<SignIn />} /> 
        <Route path="/signup" element={<SignUp/>} /> 
        <Route path="/profile" element={<Profile/>} /> 
        <Route path="/get-book-details/:id" element={<BookDeatils/>} /> 
      
        
      </Routes>
    </Router>
  );
};

export default App;
