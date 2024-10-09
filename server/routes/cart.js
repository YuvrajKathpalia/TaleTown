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
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ msg: 'Book not found' });

        const bookInCart = user.cart.find(item => item.book && item.book.toString() === bookId);
        if (bookInCart) {
            return res.status(400).json({ msg: 'Book is already in the cart' });
        }

        // Add the book to the cart with the book's _id
        user.cart.push({ book: bookId, quantity: 1, _id: book._id }); 
        await user.save();

        res.status(200).json({ msg: 'Book added to cart', cart: user.cart });
    } catch (error) {
        console.error('Error adding book to cart:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.delete('/remove-from-cart/:bookId', authenticateToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        const bookInCart = user.cart.find(cartItem => cartItem.book.toString() === bookId);
        if (!bookInCart) {
            return res.status(404).json({ msg: 'Book not found in cart' });
        }

        user.cart = user.cart.filter(cartItem => cartItem.book.toString() !== bookId);
        await user.save();

        const updatedUser = await User.findById(userId).populate('cart.book');
        return res.status(200).json({ msg: 'Book removed from cart', cart: updatedUser.cart });
    } catch (error) {
        console.error('Error removing book from cart:', error);
        return res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
});


router.get('/get-cart-info', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .populate({
                path: 'cart.book',
                model: 'book',
            });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const populatedCart = user.cart.map(item => ({
            quantity: item.quantity,
            _id: item._id,
            book: item.book ? {
                _id: item.book._id,
                title: item.book.title,
                url: item.book.url,
                price: item.book.price,
                author: item.book.author,
            } : null,
        }));

        console.log('Fetched cart info with details:', populatedCart);

        res.status(200).json({ cart: populatedCart });
    } catch (error) {
        console.error('Error retrieving cart info:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


router.put('/update-cart/:bookId', authenticateToken, async (req, res) => {
    const { bookId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Validate quantity..
    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
    }

    try {
        const user = await User.findById(userId);
        if (!user || !user.cart) {
            return res.status(404).json({ message: 'User or cart not found' });
        }

        console.log('Updating cart for book ID:', bookId);

        const bookInCart = user.cart.find(item => item.book.toString() === bookId);
        if (!bookInCart) {
            return res.status(404).json({ message: 'Book not found in cart' });
        }

        // Update the quantity of the book in the cart..
        bookInCart.quantity = quantity;
        await user.save();

        return res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ message: 'Failed to update cart', error: error.message });
    }
});


router.delete('/clear-cart', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Clear the users cart
        user.cart = [];
        await user.save();

        res.status(200).json({ msg: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});


//add to save for later,remove from cart

router.put('/save-for-later/:bookId', authenticateToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;
  
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });
  
        // Check if the book exists
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ msg: 'Book not found' });
  
        // Check if the book is already in the saved for later list
        const bookInSaved = user.savedBooks.find(item => item.book.toString() === bookId);
        if (bookInSaved) {
            return res.status(400).json({ msg: 'Book is already saved for later' });
        }
  
        // Check if the book is in the cart and remove it
        const bookInCart = user.cart.find(item => item.book.toString() === bookId);
        if (bookInCart) {
            user.cart = user.cart.filter(item => item.book.toString() !== bookId);
        }
  
        // Add the book to the saved for later list..
        user.savedBooks.push({ book: bookId });
        await user.save();
  
        res.status(200).json({ msg: 'Book saved for later', savedBooks: user.savedBooks, cart: user.cart });
    } catch (error) {
        console.error('Error saving book for later:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.get('/get-saved-books', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate('savedBooks.book');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ savedBooks: user.savedBooks });
    } catch (error) {
        console.error('Error retrieving saved books:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


router.delete('/remove-saved/:bookId', authenticateToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const bookInSaved = user.savedBooks.find(item => item.book.toString() === bookId);
        if (!bookInSaved) {
            return res.status(404).json({ msg: 'Book not found in saved for later' });
        }

        user.savedBooks = user.savedBooks.filter(item => item.book.toString() !== bookId);
        await user.save();

        return res.status(200).json({ msg: 'Book removed from saved for later', savedBooks: user.savedBooks });
    } catch (error) {
        console.error('Error removing book from saved for later:', error);
        return res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
});

// move book from saved for later to cart
router.put('/move-to-cart/:bookId', authenticateToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;
  
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });
  
        
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ msg: 'Book not found' });
  

        const bookInCart = user.cart.find(item => item.book.toString() === bookId);
        if (bookInCart) {
            return res.status(400).json({ msg: 'Book is already in the cart' });
        }
  
        const bookInSaved = user.savedBooks.find(item => item.book.toString() === bookId);
        if (!bookInSaved) {
            return res.status(404).json({ msg: 'Book not found in saved for later' });
        }
  
        // Remove the book from saved for later and add it to the cart
        user.savedBooks = user.savedBooks.filter(item => item.book.toString() !== bookId);
        user.cart.push({ book: bookId, quantity: 1, _id: book._id }); 
        await user.save();
  
        res.status(200).json({ msg: 'Book moved to cart', cart: user.cart, savedBooks: user.savedBooks });
    } catch (error) {
        console.error('Error moving book to cart:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
