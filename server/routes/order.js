const express = require('express');
const router = express.Router();
const Order = require('../models/order'); 
const User = require('../models/Users'); 
const Book = require('../models/book');
const { authenticateToken } = require('../middleware/Auth');

router.post('/place-order', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let orders = req.body.orders; // client bhejega book ids ka array..

    console.log("Request body:", req.body);

    let orderIds = [];

    console.log("Orders received:", orders);


    for (const orderData of orders) {

      if (!orderData || !orderData._id) {
        return res.status(400).json({ message: "Invalid order data" });
      }

      // Create a new Order document for each book in the orderr.
      const newOrder = new Order({
        user: userId,
        book: orderData._id,
      });
      const savedOrder = await newOrder.save();
      
    
      orderIds.push(savedOrder._id);
    }

    ///clear cart and store userids..

    await User.findByIdAndUpdate(userId, {
      $push: { orders: { $each: orderIds } },
      $pull: { cart: { $in: orders.map(order => order._id) } }
    });

   
    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


//for users..

router.get('/order-history', authenticateToken, async (req, res) => {
    try {
      
        const userId = req.user.id;

        const userData = await User.findById(userId)
            .populate({
                path: 'orders',
                populate: {
                    path: 'book',
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
