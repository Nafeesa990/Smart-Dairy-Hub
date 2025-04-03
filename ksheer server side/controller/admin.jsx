const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

// Schema
const adminloginSchema = mongoose.Schema({
    uname: String,
    passw: String
});

// Model
const adminModel = mongoose.model("adminlogin_tbl", adminloginSchema);

const app = express();


// Configure express-session middleware
app.use(session({
    secret: 'yourSecretKey', // Change this to a secret key
    resave: false,
    saveUninitialized: false
}));

// Create fixed admin user
const fixedAdmin = new adminModel({
    uname: "test",
    passw: "test@123"
});

fixedAdmin.save()
    .then(() => console.log("Admin login Successfully"))
    .catch(err => console.error('Error creating fixed admin user:', err));

// Logout route
// Logout API
app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: "Logout failed", success: false });
            }
            res.json({ message: "Logout successful", success: true });
        });
    } else {
        res.status(400).json({ message: "No active session", success: false });
    }
});


module.exports = app; // Export the Express app for use in index.js or wherever you start your server
