import React from "react";
import { useLocation } from "react-router-dom";
import "../../css/payment.css";

function Payment() {
    const location = useLocation();
    const userId = localStorage.getItem("userId");  
    const username = localStorage.getItem("username");
    const { shippingInfo, cartItems, totalAmount } = location.state || {};

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
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert("Failed to load Razorpay SDK. Please check your internet connection.");
                return;
            }

            const keyResponse = await fetch("http://localhost:9000/pay/get-key");
            const { key } = await keyResponse.json();

            const orderResponse = await fetch("http://localhost:9000/pay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: totalAmount * 100 }),
            });

            const orderData = await orderResponse.json();
            if (!orderData.id) {
                throw new Error("Failed to create Razorpay order");
            }

            const options = {
                key,
                amount: orderData.amount,
                currency: "INR",
                name: "Smart Dairy Hub",
                description: "Dairy Products",
                order_id: orderData.id,
                handler: async function (response) {
                    alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
                    await savePaymentDetails(userId, username, response, orderData.id, totalAmount);
                },
                prefill: {
                    name: username || "Customer Name",
                    email: "customer@example.com",
                    contact: shippingInfo?.contactNumber || "9876543210",
                },
                theme: { color: "#3399cc" },
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed. Try again.");
        }
    };

    const savePaymentDetails = async (userId, username, paymentResponse, orderId, amount) => {
        try {
            if (!userId) {
                throw new Error("User ID is missing. Unable to save payment details.");
            }

            const paymentData = {
                userId,
                username,
                orderId,
                paymentId: paymentResponse.razorpay_payment_id,
                amount,
                paid_to:"admin",
                status: "Success",
                cartItems,
                shippingInfo
            };

            const paymentRes = await fetch("http://localhost:9000/pay/save-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
            });

            const paymentResult = await paymentRes.json();
            
            if (paymentResult.success) {
                console.log("Payment details saved!");
                await saveOrderDetails(userId, orderId, paymentResponse, amount);
            } else {
                throw new Error("Failed to save payment details.");
            }
        } catch (error) {
            console.error("Error saving payment:", error);
            alert("Payment record failed. Contact support.");
        }
    };

    const saveOrderDetails = async (userId, orderId, paymentResponse, amount) => {
        try {
            const orderData = {
                userId,
                orderId,
                paymentId: paymentResponse.razorpay_payment_id,
                amount,
                status: "Success",
                cartItems,
                shippingInfo
            };
    
            console.log("🚀 Sending Order Data:", JSON.stringify(orderData)); // Debugging
    
            const res = await fetch("http://localhost:9000/order/save-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });
    
            const text = await res.text(); // Read response as text for debugging
            console.log("🔹 Response Text:", text);
    
            try {
                const data = JSON.parse(text); // Ensure JSON response
                if (data.success) {
                    alert("Order placed successfully!");
                    window.location.href = "/Order";
                } else {
                    throw new Error(data.message || "Failed to save order.");
                }
            } catch (jsonError) {
                console.error("❌ Invalid JSON response from server:", text);
                throw new Error("Unexpected response from server.");
            }
        } catch (error) {
            console.error("❌ Error saving order:", error);
            alert("Order confirmation failed. Contact support.");
        }
    };
    
    
    
    

    return (
        <div className="payment-container">
            <div className="progress-bar">
                <h3>Summary</h3>
            </div>
            <div className="cart-details">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems?.map((item, index) => (
                            <tr key={index}>
                                <td><img src={`http://localhost:9000/${item.image}`} alt={item.name} className="cart-image" /></td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.price}</td>
                                <td>₹{item.price * item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="order-summary">
                <div className="summary-details">
                    <h3>Order Summary</h3>
                    <p>Items: <span>{cartItems?.reduce((total, item) => total + item.quantity, 0)}</span></p>
                    <p>Shipping: <span>₹0.00</span></p>
                    <p><strong>Total: ₹{(totalAmount).toFixed(2)}</strong></p>
                </div>

                <div className="shipping-payment">
                    <div className="shipping">
                        <h3>Shipping</h3>
                        <p><strong>Address:</strong> {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.postalCode}</p>
                        <p><strong>Contact:</strong> {shippingInfo?.contactNumber}</p>
                    </div>
                    <div className="payment-method">
                        <h3>Payment Method</h3>
                        <p><strong>Method:</strong> {shippingInfo?.paymentMethod}</p>
                    </div>
                </div>
            </div>

            <button className="place-order-button" onClick={handlePayment}>
                Pay ₹{totalAmount}
            </button>
        </div>
    );
}

export default Payment;
