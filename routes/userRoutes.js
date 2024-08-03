// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin credentials
const defaultAdmin = {
    username: 'admin',
    password: 'admin123'
};

// Register user (for simplicity, only used for admin)
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const newUser = new User({ username, password, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        if (username === defaultAdmin.username && password === defaultAdmin.password && role === 'admin') {
            const token = jwt.sign({ username, role }, 'secret', { expiresIn: '1h' });
            return res.json({ token, role });
        }

        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password) && user.role === role) {
            const token = jwt.sign({ username, role }, 'secret', { expiresIn: '1h' });
            return res.json({ token, role });
        }

        res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
