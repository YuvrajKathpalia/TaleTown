const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;  

console.log(uri);

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

  app.get("/" , (req,res) => {
    res.send("hellloo");
  });

  const authRoutes = require('./routes/authentication');
  const bookRoutes = require('./routes/book');
  const userRoutes = require('./routes/users');
  const cartRoutes = require('./routes/cart');
  const orderRoutes = require('./routes/order');

  app.use('/api/auth', authRoutes);
  app.use('/api/auth/' , bookRoutes);
  app.use('/api/auth/' , userRoutes);
  app.use('/api/auth/' , cartRoutes);
  app.use('/api/auth/' , orderRoutes);
  
  console.log("MONGO_URI:", process.env.MONGO_URI);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  