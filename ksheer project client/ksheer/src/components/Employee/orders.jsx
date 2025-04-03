import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashb from './deliverydash.jsx';
import "../../css/orders.css";

const Orders = () => {
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

    const updateOrderStatus = async (orderId, currentStatus, backward = false) => {
        try {
            const nextStatus = backward ? getPreviousStatus(currentStatus) : getNextStatus(currentStatus);

            const updatedOrders = orders.map((order) =>
                order._id === orderId ? { ...order, status: nextStatus } : order
            );

            setOrders(updatedOrders);

            await axios.put('http://localhost:9000/order/update-status', {
                orderId,
                status: nextStatus,
            });

            alert(`Order status updated to ${nextStatus}`);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status.');
        }
    };

    const getNextStatus = (status) => {
        switch (status) {
            case 'Pending': return 'Out for Delivery'; // Skip 'Shipped'
            case 'Out for Delivery': return 'Delivered';
            default: return 'Pending';
        }
    };
    
    const getPreviousStatus = (status) => {
        switch (status) {
            case 'Delivered': return 'Out for Delivery';
            case 'Out for Delivery': return 'Pending'; // Skip 'Shipped'
            default: return 'Pending';
        }
    };
    
    const getProgress = (status) => {
        switch (status) {
            case 'Pending': return 33;
            case 'Out for Delivery': return 66;
            case 'Delivered': return 100;
            default: return 0;
        }
    };
    

    if (loading) return <p className="loading">Loading orders...</p>;

    if (orders.length === 0) return <p className="no-orders">No orders found.</p>;

    return (
        <div><Dashb />
            <div className="orders-container modern-container">
                <h1 className="title">Order List</h1>
                {orders.map((order) => (
                    <div key={order._id} className={`order-card ${order.status === 'Delivered' ? 'disabled' : ''}`}>

                        <div className="order-header">
                            <h3>Order ID: {order._id}</h3>
                            <p className={`status ${order.status.toLowerCase()}`}>
                                <strong>Status:</strong> {order.status}
                            </p>
                        </div>

                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${getProgress(order.status)}%` }}></div>
                        </div>

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

                        {order.shippingInfo && (
                            <div className="shipping-info">
                                <h4>Shipping Info:</h4>
                                <p><strong>Address:</strong> {order.shippingInfo.address}</p>
                                <p><strong>City:</strong> {order.shippingInfo.city}</p>
                                <p><strong>Postal Code:</strong> {order.shippingInfo.postalCode}</p>
                            </div>
                        )}

                        <div className="action-buttons">
                            {order.status !== 'Delivered' && (
                                <button onClick={() => updateOrderStatus(order._id, order.status)} className="update-button">

                                    {order.status === 'Pending' && 'Mark as Out for Delivery'}
                                    {order.status === 'Out for Delivery' && 'Mark as Delivered'}
                                </button>
                            )}

                            {/* {order.status !== 'Pending' && order.status !== 'Delivered' && (
                                <button onClick={() => updateOrderStatus(order._id, order.status, true)} className="revert-button">Revert Status</button>
                            )} */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;