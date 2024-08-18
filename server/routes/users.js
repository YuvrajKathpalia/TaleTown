const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Book = require('../models/book');
const { authenticateToken } = require('../middleware/Auth');



router.post('/add-to-favourites/:bookId', authenticateToken, async (req, res) => {

  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    if (user.favourites.includes(bookId)) {
      return res.status(400).json({ msg: 'Book is already in favorites' });
    }

    user.favourites.push(bookId);
    await user.save();

    res.status(200).json({ msg: 'Book added to favorites', favorites: user.favourites });
  } 
  
  catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});


router.delete('/remove-from-favourites/:bookId', authenticateToken, async (req, res) => {
    try {
      const { bookId } = req.params;
      const userId = req.user.id;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      if (!user.favourites.includes(bookId)) {
        return res.status(400).json({ msg: 'Book is not in your favourites' });
      }
  
      user.favourites = user.favourites.filter(favouriteBookId => favouriteBookId.toString() !== bookId);
      await user.save();
  
      res.status(200).json({ msg: 'Book removed from favourites', favourites: user.favourites });
    } catch (error) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  

  router.get('/get-favourite-books', authenticateToken, async (req, res) => {
    const userId = req.user.id; 
    try {
      
      const user = await User.findById(userId).populate('favourites');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      const favouriteBooks = user.favourites;
  
      res.status(200).json(favouriteBooks);
    } catch (error) {
      console.error('Error fetching favorite books:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;
