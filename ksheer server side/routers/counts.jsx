const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();

// Importing Models
const Farmer = mongoose.model('farmer_tbl'); // Farmer collection
const customerModel = mongoose.model('customer_tbl'); // Customer collection

// API Endpoint to Get User Counts
router.get('/getUserCounts', async (req, res) => {
    try {
        // Count customers from "customer_tbl"
        const totalCustomers = await customerModel.countDocuments();

        // Count farmers from "farmer_tbl"
        const totalFarmers = await Farmer.countDocuments();

        // Calculate total users
        const totalUsers = totalCustomers + totalFarmers;

        // Log the counts in the console
        // console.log(`Total Customers: ${totalCustomers}`);
        // console.log(`Total Farmers: ${totalFarmers}`);
        // console.log(`Total Users: ${totalUsers}`);

        // Send response
        res.json({
            totalCustomers,
            totalFarmers,
            totalUsers
        });
    } catch (error) {
        console.error("Error fetching user counts:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Export router
module.exports = router;
