const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fifa_jwt_secret_token_123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware to verify admin JWT token
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access forbidden. Not an admin.' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Admin Login
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, message: 'Logged in successfully' });
  } else {
    return res.status(401).json({ error: 'Incorrect admin password' });
  }
});

// Verify token validity
router.get('/verify', authenticateAdmin, (req, res) => {
  res.json({ valid: true, role: 'admin' });
});

module.exports = {
  router,
  authenticateAdmin
};
