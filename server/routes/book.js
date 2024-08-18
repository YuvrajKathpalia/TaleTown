const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Book = require('../models/book');
const { authenticateToken } = require('../middleware/Auth');

//adding book(for admin only)..

router.post('/add-books', authenticateToken, async (req, res) => {

    try {

        const userId = req.user.id; 
        const user = await User.findById(userId);

        if (user.role !== 'admin') {
            return res.status(400).json({ message: "Access denied: Admin privileges required."});
        }

        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            description: req.body.desc,
            language: req.body.language,
        });

        await book.save();

        res.status(200).json({ message: 'Book added successfully' });
    } 
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.put('/update-book/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; 
    const { url, title, author, price, desc, language } = req.body; 
  
    try {
    
      const updatedBook = await Book.findByIdAndUpdate(
        id,
        { url, title, author, price, desc, language },
        { new: true, runValidators: true } 
      );
  
      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } 
    catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.get('/get-all-books', async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } 
    catch (error) {
      console.error('Error retrieving books:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete('/delete-book/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
  
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
  
      const bookId = req.params.id;
      const deletedBook = await Book.findByIdAndDelete(bookId);
  
      if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      res.status(200).json({ message: 'Book deleted successfully' });
    } 
    catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  router.get('/get-book/:id', async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      res.status(200).json(book);
    } catch (error) {
      console.error('Error retrieving the book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
module.exports = router;
