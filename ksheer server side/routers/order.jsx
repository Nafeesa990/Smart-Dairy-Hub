const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    cartItems: [
        {
            name: { type: String, required: true },
            image: { type: String },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        contactNumber: { type: String, required: true }, // Added Contact Number
        paymentMethod: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ["Pending", "Out for Delivery", "Delivered", "Failed"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const OrderModel = mongoose.model("Order", orderSchema);

router.get("/customer-orders", async (req, res) => {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ success: false, message: "User ID is required." });

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: "Invalid User ID format." });
    }

    try {
        const customerOrders = await OrderModel.find({ userId }).sort({ createdAt: -1 });

        if (!customerOrders.length) {
            return res.status(200).json({ success: true, orders: [] });
        }

        res.status(200).json({ success: true, orders: customerOrders });
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Save a new order
router.post("/save-order", async (req, res) => {
    console.log("🟢 Received Data:", req.body); // Debug JSON payload
    
    try {
        const { userId, orderId, paymentId, amount, cartItems, shippingInfo } = req.body;

        if (!userId || !orderId || !paymentId || !amount || !cartItems || !shippingInfo || !shippingInfo.contactNumber) {
            console.log("❌ Missing fields:", req.body);
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const newOrder = new OrderModel({
            userId,
            orderId,
            paymentId,
            amount,
            cartItems,
            shippingInfo,
            status: "Pending",
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving order:", error);
        res.status(500).json({ success: false, message: "Failed to save order.", error: error.message });
    }
});




// Get all orders 
router.get('/all-orders', async (req, res) => {
    try {
        const orders = await OrderModel.find({})
            .select('cartItems status shippingInfo createdAt')
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        if (orderId === "all-orders") {
            const orders = await OrderModel.find({})
                .select('cartItems status shippingInfo createdAt')
                .sort({ createdAt: -1 });
            return res.status(200).json({ orders });
        }

        const order = await OrderModel.findOne({ orderId }).select('cartItems status shippingInfo createdAt');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Update order status
router.put("/update-status", async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ message: "Order ID and status are required." });
        }

        const updatedOrder = await OrderModel.findOneAndUpdate(
            { _id: orderId },
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.status(200).json({ message: "Order updated successfully", updatedOrder });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
