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


  app.use('/api/auth', authRoutes);

  console.log("MONGO_URI:", process.env.MONGO_URI);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  
  const port = process.env.PORT || 2000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  