const express = require('express');
const mongoose = require('mongoose'); 
const Order = require('../models/order'); 
const User = require('../models/Users'); 
const { authenticateToken } = require('../middleware/Auth');

const router = express.Router();


router.post('/place-order', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = req.body.orders;
    const total = req.body.total;

    console.log("Request body:", req.body);


    if (!Array.isArray(orders) || orders.length === 0 || !orders.every(order => order.book)) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Map orders to extract book ObjectId and other data
    const orderBooks = orders.map(orderData => {
      if (!mongoose.Types.ObjectId.isValid(orderData.book)) {
        return res.status(400).json({ message: `Invalid book ID: ${orderData.book}` });
      }
      return {
        book: orderData.book,
        quantity: orderData.quantity || 1,
        price: orderData.price || 0,
      };
    });

    console.log("Mapped Orders:", orderBooks);

    
    const newOrder = new Order({
      user: userId,
      orders: orderBooks,
      status: "Order Placed",
    });

    const savedOrder = await newOrder.save();

    // Update user order history and clear cart for ordered books...
    await User.findByIdAndUpdate(userId, {
      $push: { orders: savedOrder._id },
      $pull: { cart: { $in: orders.map(order => order.book) } }
    });

    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


router.get('/order-history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await User.findById(userId)
      .populate({
        path: 'orders',
        populate: {
          path: 'orders.book',
          model: 'book',
          select: 'title author price'
        }
      });

    const ordersData = userData.orders.reverse();

    return res.json({
      status: 'Success',
      data: ordersData
    });
  } catch (error) {
    console.error('Error fetching order history:', error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});


// get all orderss(admin)..

router.get('/get-all-orders', authenticateToken,  async (req, res) => {
  try {
    
    const orders = await Order.find()
      .populate({
        path: 'book',
        model: 'book'
      })
      .populate({
        path: 'user', 
      })
      .sort({ createdAt :-1});

    return res.json({
      status: 'Success',
      data: orders
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});


//update ordr status of a order id..(admin).

router.put('/update-status/:id', authenticateToken,  async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body; 

    
    const validStatuses = ['Order Placed', 'Out for delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

  
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({
      status: 'Success',
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
