const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token received in middleware:', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded token:', decoded); 

    if (!decoded || !decoded.user || !decoded.user.id) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    req.user = decoded.user;
    next();
  } catch (e) {
    console.error('Token verification error:', e);

    if (e.name === 'TokenExpiredError') {
      return res.status(403).json({ msg: 'Token expired, please log in again.' });
    }

    return res.status(401).json({ msg: 'Token is not valid, please sign in again.' });
  }
};

const authorizeAdmin = (req, res, next) => {
  // Check if the token is present and decoded
  if (!req.user) {
    return res.status(403).json({ msg: 'Access denied: no user found' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: you are not an admin' });
  }
  
 //else proceed to next api.
  next();
};


module.exports = { authenticateToken, authorizeAdmin };
