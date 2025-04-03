const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const router = express.Router();

// Schema
const customerSchema = mongoose.Schema({
    username: String,
    password: String
});

// Model
const customerModel = mongoose.models.customer_tbl || mongoose.model("customer_tbl", customerSchema);


// Configure express-session middleware
router.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false
}));

// Customer Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const customer = await customerModel.findOne({ username, password });
        if (customer) {
            req.session.customer = customer;
            
            // Send userId along with the response
            res.json({ 
                message: 'Login successful', 
                userId: customer._id,  // ✅ Include userId
                customer 
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ message: 'Error logging out' });
        } else {
            res.json({ message: 'Logged out successfully' });
        }
    });
});

module.exports = router;
