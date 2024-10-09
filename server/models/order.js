const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  orders: [
    {
      book: {
        type: mongoose.Types.ObjectId,
        ref: "book",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    default: "Order Placed",
    enum: ["Order Placed", "Out for delivery", "Delivered", "Cancelled"],
  },
}, { timestamps: true });


module.exports = mongoose.model('order', OrderSchema); 

