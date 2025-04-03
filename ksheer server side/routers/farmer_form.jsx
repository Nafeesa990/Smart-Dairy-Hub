const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Schema
const farmerFormSchema = mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'farmer_tbl' }, // Store farmerId explicitly
    farmerName: String,
    email: String,
    phone: String,
    farmLocation: String,
    milkQuantity: Number,
    paymentStatus: { type: String, default: 'pending' }, // New: Payment status
    paymentAmount: { type: Number, default: 0 },         // New: Payment amount
    submittedAt: { type: Date, default: Date.now }
});

// Model
const FarmerFormModel = mongoose.models.farmer_form || mongoose.model("farmer_form", farmerFormSchema);
const Farmer = mongoose.models.farmer_tbl || mongoose.model('farmer_tbl');

// ✅ Route to submit farmer form
router.post('/submit-form', async (req, res) => {
    try {
        const { farmerId, farmerName, email, phone, farmLocation, milkQuantity } = req.body;

        // Validate farmerId
        if (!mongoose.Types.ObjectId.isValid(farmerId)) {
            return res.status(400).json({ error: 'Invalid farmerId' });
        }

        // Check if farmer exists
        const farmerExists = await Farmer.findById(farmerId);
        if (!farmerExists) {
            return res.status(400).json({ error: 'Farmer not found' });
        }

        // Create new form entry
        const newForm = new FarmerFormModel({
            farmerId,
            farmerName,
            email,
            phone,
            farmLocation,
            milkQuantity
        });

        await newForm.save();
        res.status(201).send('Form submitted successfully');
    } catch (error) {
        console.error('❌ Error submitting form:', error);
        res.status(500).send('Internal server error');
    }
});

// ✅ Route to get all submitted forms (with farmer details)
router.get('/all-forms', async (req, res) => {
    try {
        const forms = await FarmerFormModel.find();
        res.json(forms);
    } catch (error) {
        console.error('❌ Error fetching forms:', error);
        res.status(500).send('Internal server error');
    }
});

// ✅ Route to update payment status and amount (for farmer form)
router.put('/update-payment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus, paymentAmount } = req.body;

        // Validate form ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid form ID' });
        }

        // Update payment details
        const updatedForm = await FarmerFormModel.findByIdAndUpdate(
            id,
            { paymentStatus, paymentAmount },
            { new: true }
        );

        if (!updatedForm) {
            return res.status(404).json({ error: 'Farmer form not found' });
        }

        res.status(200).json({ message: 'Payment updated successfully', updatedForm });
    } catch (error) {
        console.error('❌ Error updating payment:', error);
        res.status(500).send('Internal server error');
    }
});

// Export router
module.exports = router;
