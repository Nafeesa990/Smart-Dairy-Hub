import React, { useState, useEffect } from "react";
import "../../css/shipping.css";
import { useNavigate, useLocation } from "react-router-dom";

function ShippingDetails() {
    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        postalCode: "",
        contactNumber: "", // Added contact number field
        paymentMethod: "RazorPay",
    });

    const navigate = useNavigate();
    const location = useLocation();
    
    const userId = location.state?.userId || localStorage.getItem("userId");
    const totalAmount = location.state?.totalAmount || 0;
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        localStorage.setItem("progress", "shipping");
        
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        console.log("Cart Items in Shipping Page:", storedCart);
    
        setCartItems(storedCart);
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo({ ...shippingInfo, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.contactNumber) {
            alert("Please fill in all fields");
            return;
        }

        console.log("Address Details Submitted:", shippingInfo);
        navigate("/Payment", { state: { shippingInfo, cartItems, totalAmount, userId } });
    };

    return (
        <div className="shipping-container">
            {/* Progress Tracker */}
            {/* <div className="progress-tracker">
                <div className="step active">Address</div>
                <div className="step">Payment</div>
                <div className="step">Summary</div>
            </div> */}

            <h2>Address</h2> {/* Changed Heading */}

            <form onSubmit={handleSubmit}>
                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    required
                />

                <label>City:</label>
                <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    required
                />

                <label>Postal Code:</label>
                <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleChange}
                    required
                />

                {/* Contact Number Field */}
                <label>Contact Number:</label>
                <input
                    type="text"
                    name="contactNumber"
                    value={shippingInfo.contactNumber}
                    onChange={handleChange}
                    required
                />

                <label>Payment Method:</label>
                <div className="payment-options">
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="RazorPay"
                            checked={shippingInfo.paymentMethod === "RazorPay"}
                            onChange={handleChange}
                        />
                        RazorPay
                    </label>
                </div>

                <button type="submit" className="continue-button">
                    Continue
                </button>
            </form>
        </div>
    );
}

export default ShippingDetails;
