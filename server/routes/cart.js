const express = require('express');
const router = express.Router();
const User = require('../models/Users'); 
const Book = require('../models/book'); 
const { authenticateToken } = require('../middleware/Auth'); 


router.put('/add-to-cart/:bookId', authenticateToken, async (req, res) => {

  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    if (user.cart.includes(bookId)) {
      return res.status(400).json({ msg: 'Book is already in the cart' });
    }

    // Add boook id of the book to the cart....
    user.cart.push(bookId);
    await user.save();

    res.status(200).json({ msg: 'Book added to cart', cart: user.cart });
  } 
  catch (error) {
    console.error('Error adding book to cart:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


router.put('/remove-from-cart/:bookId', authenticateToken, async (req, res) => {
    try {
      const { bookId } = req.params;
      const userId = req.user.id;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      if (!user.cart.includes(bookId)) {
        return res.status(400).json({ msg: 'Book not found in cart' });
      }
  
      
      user.cart = user.cart.filter(cartBookId => cartBookId.toString() !== bookId);
      await user.save();
  
      res.status(200).json({ msg: 'Book removed from cart', cart: user.cart });
    } 
    catch (error) {
      console.error('Error removing book from cart:', error);
      res.status(500).json({ msg: 'Internal server error' });
    }
  });
  

  router.get('/get-cart-info', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        //populate cart with actual book details(cart me books ka ref dia tha na users schema me)..
        const user = await User.findById(userId).populate('cart');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

    
        res.status(200).json({ cart: user.cart });
    } 
    catch (error) {
        console.error('Error retrieving cart info:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
