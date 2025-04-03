const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const farmerSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    approvedByAdmin: { type: Boolean, default: false }
});

// Farmer Model
const Farmer = mongoose.models.farmer_tbl || mongoose.model("farmer_tbl", farmerSchema)


// Fetch Pending Farmers for Admin Verification
router.get('/pending-farmers', async (req, res) => {
    try {
        const pendingFarmers = await Farmer.find({ approvedByAdmin: false });
        res.json(pendingFarmers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Admin Approves Farmer
router.put('/approve-farmer/:id', async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

        farmer.approvedByAdmin = true;
        await farmer.save();

        res.json({ message: 'Farmer approved successfully', farmer });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


// Reject Farmer (Delete)
router.delete('/reject-farmer/:id', async (req, res) => {
    try {
        console.log("inside")
        const farmer = await Farmer.findByIdAndDelete(req.params.id);
        if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

        res.json({ message: 'Farmer rejected and removed from database' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
