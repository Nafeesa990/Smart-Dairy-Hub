import React, { useEffect, useState } from "react";
import { useLocation,useNavigate} from "react-router-dom";
import axios from "axios";
import '../../css/adminpay.css';

function AdminPay() {
    const location = useLocation();
    const { formData, farmerName } = location.state || {};
    const navigate = useNavigate();

    const [qualityCheck, setQualityCheck] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);

    useEffect(() => {
        const fetchQualityCheck = async () => {
            if (!formData || !formData._id) return;
            try {
                const response = await axios.get(`http://localhost:9000/quality_check/all/${formData._id}`);
                setQualityCheck(response.data.length > 0 ? response.data[0] : null);
            } catch (error) {
                console.error("Error fetching quality check details:", error);
            }
        };
        fetchQualityCheck();
    }, [formData]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            // ✅ Load Razorpay script
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert("Failed to load Razorpay SDK. Please check your internet connection.");
                return;
            }
    
            // ✅ Fetch Razorpay Key
            const keyResponse = await fetch("http://localhost:9000/pay/get-key");
            if (!keyResponse.ok) throw new Error("Failed to fetch Razorpay key.");
            const { key } = await keyResponse.json();
    
            // ✅ Create a Razorpay Order
            const orderResponse = await fetch("http://localhost:9000/pay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: paymentAmount * 100 }), // Amount in paise (INR * 100)
            });
    
            if (!orderResponse.ok) throw new Error("Failed to create Razorpay order.");
            const orderData = await orderResponse.json();
    
            if (!orderData.id) throw new Error("Invalid order ID from Razorpay.");
    
            // ✅ Razorpay Payment Options
            const options = {
                key,
                amount: orderData.amount,
                currency: "INR",
                name: "Smart Dairy Hub",
                description: "Payment to Farmer",
                order_id: orderData.id,
                handler: async (response) => {
                    try {
                        // ✅ 1. Update "quality_check" table
                        await axios.put(`http://localhost:9000/quality_check/update-status/${formData._id}`, {
                            status: "paid",
                        });
    
                        // ✅ 2. Update "farmer_form" table
                        await axios.put(`http://localhost:9000/farmer_form/update-payment/${formData._id}`, {
                            paymentStatus: "paid",
                            paymentAmount: paymentAmount,
                        });
    
                        // ✅ 3. Save payment in "payment_record" table
                        const paymentData = {
                            userId: "67d8f819307065d5295e1f6d",                     
                            username:"admin",
                            orderId: orderData.id,                    
                            paymentId: response.razorpay_payment_id,  
                            amount: paymentAmount,                   
                            paid_to: farmerName ,                        
                            status: "Success",                                                   
                        };
    
                        const paymentRes = await fetch("http://localhost:9000/pay/save-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(paymentData),
                        });
    
                        if (!paymentRes.ok) throw new Error("Failed to save payment in payment_record.");
    
                        alert("Payment successful and updated in all tables!");
                        navigate("/Form"); 
                    } catch (error) {
                        console.error("Error updating payment details:", error);
                        alert("Payment succeeded, but updating records failed.");
                    }
                },
                prefill: {
                    name: "admin",
                    email: "example@gmail.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc",
                },
            };
    
            // ✅ Open Razorpay Checkout
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
    
            // ✅ Handle Payment Failure
            paymentObject.on("payment.failed", (response) => {
                alert("Payment failed. Please try again.");
                console.error("Payment failed:", response.error);
            });
        } catch (error) {
            console.error("❌ Error processing payment:", error);
            alert("Payment initiation failed. Please try again.");
        }
    };
    
    
    

    return (
        <div className="admin-pay-container">
            <div className="admin-pay-card">
                <h2 className="admin-pay-title">Milk Quality Details</h2>

                {qualityCheck ? (
                    <div className="admin-pay-section">
                        <p><strong>pH Level:</strong> {qualityCheck.pH}</p>
                        <p><strong>Temperature:</strong> {qualityCheck.temperature}°C</p>
                        <p><strong>Turbidity:</strong> {qualityCheck.turbidity}</p>
                        <p><strong>Colour:</strong> {qualityCheck.color}</p>
                        <p><strong>Fat:</strong> {qualityCheck.fat}</p>
                        <p><strong>Taste:</strong> {qualityCheck.taste}</p>
                        <p><strong>Odor:</strong> {qualityCheck.odor}</p>
                        <p>
                            <strong>Prediction:</strong>
                            <span className={qualityCheck.prediction === "0" ? "status-low" : qualityCheck.prediction === "1" ? "status-medium" : "status-good"}>
                                {qualityCheck.prediction}
                            </span>
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-red-500 mt-4">No quality details available.</p>
                )}

                <div className="payment-section">
                    <h3>Process Payment</h3>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="payment-input"
                    />
                    <button className="payment-button" onClick={handlePayment}>Pay Now</button>
                </div>
            </div>
        </div>
    );
}

export default AdminPay;
