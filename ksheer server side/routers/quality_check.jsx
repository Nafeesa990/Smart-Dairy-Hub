const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const router = express.Router();

// ✅ Define MongoDB Schema & Model
const qualityCheckSchema = new mongoose.Schema({
    farmerFormId: { type: mongoose.Schema.Types.ObjectId, ref: 'farmer_form' }, // Linking to farmer_form
    pH: Number,
    temperature: Number,
    turbidity: Number,
    color: Number,
    fat: Number,
    taste: Number,
    odor: Number,
    prediction: String, // Stores Flask's quality prediction
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }, 
    createdAt: { type: Date, default: Date.now }
});

const QualityCheck = mongoose.model('QualityCheck', qualityCheckSchema);
const FarmerForm = mongoose.model('farmer_form'); // Load the FarmerForm model

// ✅ API route to handle quality check (Insert/Update)

router.post('/submit', async (req, res) => {
    try {
        console.log('🔄 Forwarding data to Flask API...');
        console.log('Received Data:', req.body);

        const { farmerFormId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(farmerFormId)) {
            return res.status(400).json({ error: 'Invalid farmerFormId' });
        }

        const farmerExists = await FarmerForm.findById(farmerFormId);
        if (!farmerExists) {
            return res.status(404).json({ error: 'Farmer form not found' });
        }

        let prediction = 'Unknown';
        try {
            const flaskResponse = await axios.post('http://127.0.0.1:8000/predict', req.body, {
                headers: { 'Content-Type': 'application/json' }
            });
            prediction = flaskResponse.data.quality;
        } catch (flaskError) {
            console.error('❌ Error contacting Flask API:', flaskError.message);
            return res.status(502).json({ error: 'Error contacting prediction service' });
        }

        const updateData = { ...req.body, prediction, createdAt: new Date() };

        const existingQualityCheck = await QualityCheck.findOneAndUpdate(
            { farmerFormId },
            updateData,
            { new: true, upsert: true }
        );

        console.log("✅ Quality check saved/updated:", existingQualityCheck);
        return res.json({ message: 'Quality check processed successfully', prediction });

    } catch (error) {
        console.error('❌ Error in Express Server:', error.message);
        res.status(500).json({ error: 'Failed to process quality check' });
    }
});

module.exports = router;


// ✅ Route to fetch all quality check data with farmer details

router.get('/all/:farmerFormId', async (req, res) => {
    try {
        let { farmerFormId } = req.params;
        console.log("🔍 Received farmerFormId:", farmerFormId);

        if (!mongoose.Types.ObjectId.isValid(farmerFormId)) {
            return res.status(400).json({ error: 'Invalid farmerFormId' });
        }

        farmerFormId = new mongoose.Types.ObjectId(farmerFormId);

        const qualityChecks = await QualityCheck.find({ farmerFormId })
            .populate('farmerFormId') 
            .sort({ createdAt: -1 });

        if (!qualityChecks.length) {
            console.log("🚫 No records found.");
            return res.status(404).json({ message: 'No quality check data found' });
        }

        console.log("✅ Records found:", qualityChecks);
        res.json(qualityChecks);

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// ✅ Update status to "paid" after payment
router.put('/update-status/:farmerFormId', async (req, res) => {
    try {
        const { status, amount } = req.body;
        const { farmerFormId } = req.params;

        const validStatus = ['Pending', 'accepted', 'rejected', 'paid'];
        if (!status || !validStatus.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        if (!mongoose.isValidObjectId(farmerFormId)) {
            return res.status(400).json({ error: 'Invalid farmerFormId format' });
        }

        // ✅ Update QualityCheck Collection
        const updatedForm = await QualityCheck.findOneAndUpdate(
            { farmerFormId: farmerFormId },
            { status: status, amount: amount || 0 },
            { new: true }
        );

        if (!updatedForm) {
            return res.status(404).json({ error: 'No record found for the provided farmerFormId' });
        }

        res.status(200).json({ message: 'Status updated successfully', updatedForm });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/status/:farmerFormId', async (req, res) => {
    try {
        const { farmerFormId } = req.params;

        const qualityCheck = await QualityCheck.findOne({ farmerFormId: farmerFormId });

        if (!qualityCheck) {
            return res.status(404).json({ status: 'Pending', amount: 0 });
        }

        res.status(200).json({ status: qualityCheck.status, amount: qualityCheck.amount || 0 });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
