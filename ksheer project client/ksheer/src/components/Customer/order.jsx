import React, { useEffect, useState } from "react";
import Dash from "./dashcustomer";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../css/order.css";

function Order() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return alert("User not logged in.");

      try {
        const response = await fetch(`http://localhost:9000/order/customer-orders?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched Orders:", data);

        if (data.success && data.orders.length > 0) {
          setOrders(data.orders);
        } else {
          alert("No orders found.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to fetch orders.");
      }
    };

    fetchCustomerOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await fetch(`http://localhost:9000/order/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Order canceled successfully.");
        setOrders(orders.map(order => order.orderId === orderId ? { ...order, status: "Cancelled" } : order));
      } else {
        alert(data.message || "Failed to cancel order.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error cancelling order. Please try again.");
    }
  };

  const getOrderStatusTracker = (status, statusHistory) => {
    const statuses = ["Pending", "Out for Delivery", "Delivered"]; // Removed "Shipped"
    const currentIndex = statuses.indexOf(status);

    return (
      <div className="order-tracker">
        {statuses.map((s, index) => (
          <div
            key={s}
            className={`tracker-step ${index === 0 ? "completed pending" : index <= currentIndex ? "completed" : ""}`}
          >
            {s}
          </div>
        ))}
        {statusHistory && statusHistory.length > 0 && (
          <div className="status-history">
            <h4>Status History:</h4>
            <ul>
              {statusHistory.map((status, index) => (
                <li key={index}>{status}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="order-container">
      <Dash />
      <div className="order-wrapper">
        <h2 className="order-title">My Orders</h2>

        {orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div>
                  <h3 className="order-id">Order ID: {order.orderId}</h3>
                  <p className="order-amount">Total Amount: ₹{order.amount}</p>
                  <p className="order-date">Order Placed: {new Date(order.createdAt).toLocaleString()}</p>
                  {getOrderStatusTracker(order.status, order.statusHistory)}
                </div>

                <span className="dropdown-icon" onClick={() => toggleOrderDetails(order.orderId)}>
                  {expandedOrder === order.orderId ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              {expandedOrder === order.orderId && (
                <div className="order-details">
                  <h4 className="details-heading">Shipping Info:</h4>
                  <p>Address: {order.shippingInfo.address}</p>
                  <p>City: {order.shippingInfo.city}</p>
                  <p>Contact Number: {order.shippingInfo.contactNumber}</p> {/* Added Contact Number */}

                  <h4 className="details-heading">Items:</h4>
                  <ul className="item-list">
                    {order.cartItems.map((item, idx) => (
                      <li key={idx} className="item">
                        <img src={`http://localhost:9000/${item.image}`} alt={item.name} className="item-image" />
                        <span>{item.name} (x{item.quantity})</span>
                        <span className="item-price">₹{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Order;
