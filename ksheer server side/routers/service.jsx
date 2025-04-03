const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const router = express();
const secretKey = "your-secret-key";
const jwt = require("jsonwebtoken");


// Middleware
router.use(express.json());

// Configure express-session
router.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false
}));



// Session Middleware
router.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
}));

// Admin Schema
const adminSchema = new mongoose.Schema({
    uname: String,
    passw: String
});

const Admin = mongoose.model('Admin', adminSchema);

// Ensure Default Admin Exists
const createDefaultAdmin = async () => {
    const existingAdmin = await Admin.findOne({ uname: "admin" });
    if (!existingAdmin) {
        await Admin.create({ uname: "admin", passw: "admin123" });
        console.log('Default admin created');
    }
};
createDefaultAdmin();

// Admin Login Route
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Received username:", username);
        console.log("Received password:", password);

        const admin = await Admin.findOne({ uname: username, passw: password });

        if (!admin) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: admin._id, username: "admin" }, secretKey, { expiresIn: "1h" });
        console.log("Token generated successfully:", token);

        res.status(200).json({ message: "Admin logged in", token, userId: admin._id });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Admin Logout Route
router.post("/logout", (req, res) => {
    try {
        // Invalidate the token on the client side (we don't store it on the server side)
        res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Error during logout" });
    }
});


module.exports = router;
