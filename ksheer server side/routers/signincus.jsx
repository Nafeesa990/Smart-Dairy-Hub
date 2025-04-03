const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const router = express.Router();

// Schema
const customerSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// Model
const customerModel = mongoose.models.customer_tbl || mongoose.model("customer_tbl", customerSchema);


// Customer Sign-up Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if email already exists
        const existingCustomer = await customerModel.findOne({ email });
        if (existingCustomer) {
            return res.status(400).send('Email already registered');
        }

        // Create new customer
        const newCustomer = new customerModel({ username, email, password });
        await newCustomer.save();

        res.send('Customer registered successfully');
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).send('Internal server error');
    }
});

// Customer Sign-in Route
// Ensure this matches your backend route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const customer = await customerModel.findOne({ email, password });
        if (customer) {
            res.status(200).json({ message: 'Login successful', customer });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out');
        } else {
            res.send('Logged out successfully');
        }
    });
});

module.exports = router; // Export the router
