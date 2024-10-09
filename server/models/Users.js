const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  favourites: [
    {
      type: mongoose.Types.ObjectId,
      ref: "book",
    },
  ],
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
  ],
  cart: [
    {
      book: { type: mongoose.Types.ObjectId, ref: "book" },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
  savedBooks: [ 
    {
      book: { type: mongoose.Types.ObjectId, ref: "book" },
      dateSaved: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('user', UserSchema);

