const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/Users');
const { authenticateToken, authorizeAdmin } = require('../middleware/Auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_SECRET, 
});


router.post('/place-order', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = req.body.orders;
    const totalAmount = req.body.total; 

    console.log("Request body:", req.body);

  
    if (!Array.isArray(orders) || orders.length === 0 || !orders.every(order => order.book)) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const orderBooks = orders.map(orderData => {
      if (!mongoose.Types.ObjectId.isValid(orderData.book)) {
        throw new Error(`Invalid book ID: ${orderData.book}`);
      }
      return {
        book: orderData.book,
        quantity: orderData.quantity || 1,
        price: orderData.price || 0,
      };
    });

    console.log("Mapped Orders:", orderBooks);

    // Validate total amount with order data

    const calculatedTotal = orderBooks.reduce((sum, order) => sum + (order.price * order.quantity), 0) * 100;
    const roundedCalculatedTotal = Math.round(calculatedTotal);

    console.log('Calculated total (in paise):', roundedCalculatedTotal);
    console.log('Total amount from request (in paise):', totalAmount);

    if (totalAmount !== roundedCalculatedTotal) {
      return res.status(400).json({ message: "Total amount does not match the order data." });
    }

    // Create order in Razorpay
    const options = {
      amount: totalAmount,
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
      payment_capture: 1, 
    };

    const razorpayOrder = await razorpay.orders.create(options);
    console.log('Razorpay Order created:', razorpayOrder);

    const newOrder = new Order({
      user: userId,
      orders: orderBooks,
      status: "Order Placed",
      razorpayOrderId: razorpayOrder.id, // Save Razorpay order ID
    });

    const savedOrder = await newOrder.save();
    console.log('New Order Saved:', savedOrder); 

    
    await User.findByIdAndUpdate(userId, {
      $push: { orders: savedOrder._id },
      $pull: { cart: { $in: orders.map(order => order.book) } } 
    });

    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
      orderId: savedOrder._id,
      razorpayOrderId: razorpayOrder.id, 
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: "An error occurred while placing the order" });
  }
});

// Validate Order..
router.post('/validate-order', async (req, res) => {

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

  // Verify the signature
  if (expectedSignature !== razorpay_signature) {
      console.error('Signature verification failed.');
      return res.status(400).json({ msg: 'Transaction is not legit!' });
  }

  try {
      // Check if the order exists in the database
      const updatedOrder = await Order.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          { status: "Order Placed" },
          { new: true }
      );

      if (!updatedOrder) {
          console.error(`Order not found for Razorpay Order ID: ${razorpay_order_id}`);
          return res.status(404).json({ message: "Order not found" });
      }

      res.json({
          msg: 'success',
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
      });
  } catch (error) {
      console.error('Error validating order:', error);
      return res.status(500).json({ message: "An error occurred while validating the order" });
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

router.get('/get-all-orders', authenticateToken, authorizeAdmin,  async (req, res) => {
  try {

    const orders = await Order.find()
      .populate({
        path: 'orders.book',
        model: 'book'
      })
      .populate({
        path: 'user', 
        select: 'username email address role'
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

router.put('/update-status/:id', authenticateToken,authorizeAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body; 

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

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
