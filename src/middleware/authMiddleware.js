// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-2025');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalid' });
  }
};