const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure User model is properly configured
const router = express.Router();
// const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// Environment variables (add defaults for development if needed)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace with actual secret in production
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; // Token expiration time

// ========================
// Register a New User
// ========================
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Create new user
        const user = new User({ name, email, password});
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// ========================
// User Login
// ========================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        
        // Check if the user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        // Generate a JWT token
        

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// ========================
// Middleware to Verify Token
// ========================
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check for token in header
    if (!authHeader) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        // Extract token and verify it
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach decoded user information to request object
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ========================
// Protected Route Example
// ========================
router.get('/protected', auth, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Protected route to get user data
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

// ========================
// Export the Router
// ========================
module.exports = router;
