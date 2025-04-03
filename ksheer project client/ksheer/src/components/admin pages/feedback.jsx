import React, { useEffect, useState } from "react";
import AXIOS from "axios";
import "../../css/feedback.css";
import Dash from "./dash_main";

function AdminFeedback() {
    const [reviews, setReviews] = useState([]);

    // Fetch all reviews
    useEffect(() => {
        AXIOS.get("http://localhost:9000/reviews/all")
            .then((res) => setReviews(res.data.reviews))
            .catch((error) => console.error("Error fetching reviews:", error));
    }, []);

    // Delete a review
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            AXIOS.delete(`http://localhost:9000/reviews/delete/${id}`)
                .then(() => {
                    setReviews(reviews.filter((review) => review._id !== id));
                    alert("Review deleted successfully!");
                })
                .catch((error) => console.error("Error deleting review:", error));
        }
    };

    return (
        <div><Dash />
        <div className="admin-feedback-container" style={{ marginLeft: '300px' }}>
            <h2>Admin Feedback Page</h2>

            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id} className="review-item">
                        {/* <img src={`http://localhost:9000/${review.productimage}`} alt="Product" className="review-product-image" /> */}
                        <p><strong>User:</strong> {review.username}</p>
                        <p><strong>Rating:</strong> {"⭐".repeat(review.rating)}</p>
                        <p><strong>Feedback:</strong> {review.text}</p>
                        <button className="delete-button" onClick={() => handleDelete(review._id)}>Delete</button>
                    </div>
                ))
            ) : (
                <p>No reviews available.</p>
            )}
        </div>
        </div>
    );
}

export default AdminFeedback;