import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dash from "./dash_main";
import '../../css/orders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:9000/order/all-orders');

                if (response.status === 200 && Array.isArray(response.data.orders)) {
                    setOrders(response.data.orders);
                } else {
                    console.error('API Call Failed or Invalid Data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p className="loading">Loading orders...</p>;

    if (orders.length === 0) return <p className="no-orders">No orders found.</p>;

    return (
        <div className="admin-page-container">
            <Dash />
            <div className="orders-container" style={{ marginLeft: '250px', width: '70%', overflowY: 'auto', maxHeight: '80vh' }}>
                <h1 className="title">Order Details</h1>
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p><strong>Status:</strong> {order.status}</p>

                        {order.cartItems && order.cartItems.length > 0 && (
                            <div className="order-items">
                                {order.cartItems.map((item, index) => (
                                    <div key={index} className="item-card">
                                        <img src={`http://localhost:9000/${item.image}`} alt={item.name} className="item-image" />
                                        <div className="item-details">
                                            <span>{item.name} (x{item.quantity})</span>
                                            <span className="item-price">₹{item.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {order.shippingInfo && (
                            <div className="shipping-info">
                                <h4>Shipping Info:</h4>
                                <p><strong>Address:</strong> {order.shippingInfo.address}</p>
                                <p><strong>City:</strong> {order.shippingInfo.city}</p>
                                <p><strong>Postal Code:</strong> {order.shippingInfo.postalCode}</p>
                            </div>
                        )}

                        {order.paymentInfo && (
                            <div className="payment-info">
                                <h4>Payment Details:</h4>
                                <p><strong>Payment Method:</strong> {order.paymentInfo.method}</p>
                                <p><strong>Transaction ID:</strong> {order.paymentInfo.transactionId}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;
