const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token received in middleware:', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.user || !decoded.user.id) {
        return res.status(401).json({ msg: 'Token is not valid' });
      }
  
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error('Token verification error:', e);
    res.status(401).json({ msg: 'Token is not valid, Please SignIn again.' });
  }
};

module.exports = {authenticateToken}; 
