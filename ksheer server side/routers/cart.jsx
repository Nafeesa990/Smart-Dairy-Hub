const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Define Cart Schema
const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String, required: true }  // Ensure image field is included
});

const Cart = mongoose.model("cart", cartSchema);

// Add Item to Cart
router.post("/add", async (req, res) => {
    try {
        console.log("Cart Add API hit");  // ✅ Check if API is reached
        console.log("Request Body:", req.body);  // ✅ Log request payload

        const { userId, productId, name, price, quantity, image } = req.body;

        if (!userId || !productId || !name || !price || !quantity || !image) {
            console.log("❌ Missing required fields:", { userId, productId, name, price, quantity, image });
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if the item already exists in the cart
        let cartItem = await Cart.findOne({ userId, productId });

        if (cartItem) {
            cartItem.quantity += 1;
            console.log("🔄 Updated Cart Item:", cartItem);
        } else {
            cartItem = new Cart({ userId, productId, name, price, quantity, image });
            console.log("🆕 New Cart Item:", cartItem);
        }

        await cartItem.save();
        res.status(200).json({ message: "Product added to cart!", cartItem });
    } catch (err) {
        console.error("❌ Error adding to cart:", err.message);  // ✅ Log error message
        res.status(500).json({ error: err.message });
    }
});


// Get user's cart items
router.get("/:userId", async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.params.userId });
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove item from cart
router.delete("/remove/:userId/:productId", async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.params.userId, productId: req.params.productId });
        res.status(200).json({ message: "Product removed from cart!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
