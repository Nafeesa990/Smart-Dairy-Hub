import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AXIOS from "axios";
import "../../css/viewmore.css";

function ViewMore() {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product || {};
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ username:"",rating: "", text: "" });

    useEffect(() => {
        if (product._id) {
            AXIOS.get(`http://localhost:9000/reviews/display/${product._id}`).then((res) => {
                setReviews(res.data);
            });
        }
    }, [product._id]);

    const handleReviewSubmit = () => {
        const username = localStorage.getItem("username"); // Retrieve username from localStorage
        console.log(username)
        if (!username) {
            alert("Please log in to leave a review!");
            return;
        }
    
        if (newReview.rating && newReview.text) {
            const reviewData = {
                productId: product._id,
                rating: newReview.rating,
                text: newReview.text,
                username, // Add username here
            };
    
            // Send review to backend
            AXIOS.post("http://localhost:9000/reviews/add", reviewData).then(() => {
                setReviews([...reviews, reviewData]);
                setNewReview({  username:"",rating: "", text: "" });
            }).catch((error) => console.error("Error submitting review:", error));
        } else {
            alert("Please fill out both rating and review.");
        }
    };
    

    // Function to add product to cart
    const handleAddToCart = () => {
        const userId = localStorage.getItem("userId"); 
        if (!userId) {
            alert("Please log in first!");
            return;
        }
    
        const cartData = {
            userId,
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1, 
            image:product.filepath, // Ensure quantity is included
        };
    
        AXIOS.post("http://localhost:9000/cart/add", cartData)
            .then(() => alert("Product added to cart!"))
            .catch((error) => console.error("Error adding to cart:", error));
    };
    
    

    return (
        <div className="viewmore-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

            <div className="viewmore-content">
                {/* Left Side: Product Image */}
                <div className="viewmore-left">
                    <img src={`http://localhost:9000/${product.filepath}`} alt={product.name} className="product-image" />
                </div>

                {/* Right Side: Product Details */}
                <div className="viewmore-right">
                    <h2 className="viewmore-title">{product.name}</h2>
                    <p className="viewmore-price">Price: <strong>Rs.{product.price}</strong></p>
                    <div className="viewmore-ratings">⭐⭐⭐⭐⭐</div>
                    <p className="viewmore-description">{product.des}</p>
                    
                    <div className="viewmore-buttons">
                        {/* <button className="buy-button">Buy Now</button> */}
                        <button className="buy-button" onClick={handleAddToCart}>Add to Cart</button>
                    </div>
                </div>
            </div>

            {/* Review Section Below */}
            <div className="review-section">
                <h3>Write a Review</h3>
                <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}>
                    <option value="">Select Rating</option>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
                <textarea placeholder="Write your review here..." value={newReview.text} onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}></textarea>
                <button className="submit-review-button" onClick={handleReviewSubmit}>Submit</button>
            </div>

            {/* All Reviews Section */}
            <div className="all-reviews">
            <h3>All Reviews</h3>
                {reviews.length > 0 ? (
                reviews.map((review, index) => (
            <div key={index} className="review-item">
                <p><strong>{review.username}</strong></p> {/* Display username */}
                <p>Rating: {"⭐".repeat(review.rating)}</p>
                <p>{review.text}</p>
            </div>
        ))
    ) : (
        <p>No reviews yet.</p>
    )}
</div>

        </div>
    );
}

export default ViewMore;
