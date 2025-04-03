const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Updated Review Schema (with username)
const reviewSchema = new mongoose.Schema({
    productId: String,
    rating: Number,
    text: String,
    username: String, // Added username field
});

const ReviewModel = mongoose.model("reviews", reviewSchema);

// Route to add a review
router.post("/add", async (req, res) => {
    const { productId, rating, text, username } = req.body; // Accept username

    try {
        const newReview = new ReviewModel({ productId, rating, text, username });
        await newReview.save();
        res.json({ message: "Review added successfully" });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).send("Failed to add review");
    }
});

// Route to get reviews for a product
router.get("/display/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required!" });
        }

        const reviews = await ReviewModel.find({ productId }).sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error.message);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
});

router.get("/all", async (req, res) => {
    try {
        const reviews = await ReviewModel.find({});
        res.json({ reviews });
    } catch (error) {
        console.error("Error fetching all reviews:", error);
        res.status(500).send("Failed to fetch reviews");
    }
});

// Delete a review (Admin only)
router.delete("/delete/:id", async (req, res) => {
    try {
        await ReviewModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).send("Failed to delete review");
    }
});

router.get("/display/:productimage", async (req, res) => {
    const { productimage } = req.params;

    try {
        const reviews = await ReviewModel.find({ productimage });
        res.json(reviews); // Now includes the username
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send("Failed to fetch reviews");
    }
});

module.exports = router;

