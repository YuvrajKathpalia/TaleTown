const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/Users");
const {authenticateToken} = require("../middleware/Auth");

router.post('/signup', async (req, res) => {
  const { username, email, password, address } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    let usernamee = await User.findOne({ username });
    if (usernamee) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    user = new User({
      username,
      email,
      password,
      address,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role:user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "10d" }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Incorrect Password' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "555d" }, 
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          id: user._id,
          role: user.role,
          msg: "Signin Successful"
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get("/get-user-info", authenticateToken, async (req, res) => {
  try {
    
    const userId = req.user.id; 
    const user = await User.findById(userId).select("-password");

    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user information:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-address", authenticateToken, async (req, res) => {
  try {
   
    const userId = req.user.id;
    const { address } = req.body;

  
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }
    await User.findByIdAndUpdate(userId, { address });


    return res.status(200).json({ message: "Address has been updated successfully" });
  }
   catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/change-username", authenticateToken, async (req, res) => {
  const { username } = req.body;
  const userId = req.user.id;

  try {
    
    let userWithUsername = await User.findOne({ username });
    if (userWithUsername) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    await User.findByIdAndUpdate(userId, { username });
    return res.status(200).json({ message: "Username updated successfully" });

  } catch (error) {
    console.error("Error updating username:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
