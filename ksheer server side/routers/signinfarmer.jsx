const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Farmer Schema
const farmerSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    contact: Number, // Added contact field
    address: String, // Added address field
    approvedByAdmin: { type: Boolean, default: false }
});

// Farmer Model
const Farmer = mongoose.models.farmer_tbl || mongoose.model("farmer_tbl", farmerSchema);

// Farmer Signup Route
router.post('/signup', async (req, res) => {
    console.log("inside");
    const { username, email, password, contact, address } = req.body;
    try {
        const existingFarmer = await Farmer.findOne({ email });

        if (existingFarmer) return res.status(400).json({ message: 'Farmer already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newFarmer = new Farmer({
            username,
            email,
            password: hashedPassword,
            contact, // Save contact
            address, // Save address
            approvedByAdmin: false
        });

        await newFarmer.save();
        res.status(201).json({ message: 'Farmer registered successfully. Waiting for admin approval.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/login', async (req, res) => {
    console.log("Login request received:", req.body);
    try {
        const farmer = await Farmer.findOne({ email: req.body.email });
        if (!farmer) {
            console.log("Farmer not found");
            return res.status(400).json({ message: 'Farmer not found' });
        }

        console.log("Farmer found:", farmer);

        const isMatch = await bcrypt.compare(req.body.password, farmer.password);
        if (!isMatch) {
            console.log("Invalid credentials");
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!farmer.approvedByAdmin) {
            console.log("Farmer not approved");
            return res.status(403).json({ message: 'Your account is not approved by admin' });
        }

        const token = jwt.sign(
            { id: farmer._id },
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: '1h' }
        );

        // Send farmerId along with token and email
        res.json({ 
            farmerId: farmer._id, 
            token, 
            email: farmer.email, 
            username:farmer.username
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
