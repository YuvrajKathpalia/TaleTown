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
    required:true,
  },
  role: {
    type:String,
    default:"user",
    enum: ["user" , "admin"],
  }, 

  favourites:[
    {
      type:mongoose.Types.ObjectId,
      ref: "book",
    },
  ],
  orders : [
    {
        type: mongoose.Types.ObjectId,
        ref: "order",
    },
  ],
  cart:[
    {
      type:mongoose.Types.ObjectId,
      ref: "book",
    },
  ],
},
{timestamps:true}
);

module.exports = mongoose.model('user', UserSchema); 
