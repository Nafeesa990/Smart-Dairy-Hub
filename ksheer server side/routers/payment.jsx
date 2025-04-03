const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const razorpay = require("./razorpay.jsx"); // Import Razorpay instance
const crypto = require("crypto");
const axios = require('axios');
// Define Payment Schema
const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },  // Added username field
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    paid_to: { type: String, required: true },
    status: { type: String, enum: ["Success", "Failed"], required: true },
    createdAt: { type: Date, default: Date.now },
});

// Create Payment Model
const PaymentModel = mongoose.model("Payment", PaymentSchema);

router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const options = {
            amount: amount, // Convert to paisa (₹1 = 100 paisa)
            currency: "INR",
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
});

  

router.get("/get-key", (req, res) => {
   
    res.json({ key: process.env.RAZORPAY_KEY_ID });
    
});



router.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});



router.post("/save-payment", async (req, res) => {
    const { userId, username, orderId, paymentId, amount, paid_to,status, cartItems, shippingInfo } = req.body;
    
    if (!userId || !username) {
        return res.status(400).json({ success: false, message: "User ID and username are required" });
    }

    try {
        const order = new PaymentModel({
            userId,
            username,
            orderId,
            paymentId,
            amount,
            paid_to,
            status,
            cartItems,
            shippingInfo,
        });

        await order.save();
        res.json({ success: true, message: "Order saved successfully" });
    } catch (err) {
        console.error("Database save error:", err);
        res.status(500).json({ success: false, message: "Order save failed" });
    }
});

// Payment View Route
router.get("/view-payments", async (req, res) => {
    try {
        // Fetch payments including username
        const payments = await PaymentModel.find().select("userId username orderId paymentId amount status createdAt");
        res.json({ success: true, payments });
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ success: false, message: "Error fetching payments" });
    }
});


module.exports = router;
