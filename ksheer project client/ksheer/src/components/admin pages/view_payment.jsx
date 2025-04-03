import React, { useEffect, useState } from "react";
import axios from "axios";
import Dash from "./dash_main";
import "../../css/view_payment.css"; // Import the external CSS file

const AdminPaymentView = () => {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState({});

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:9000/pay/view-payments");
        setPayments(response.data.payments);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:9000/order/orders/all-orders");
        console.log("Fetched Orders in React:", response.data.orders); // Debugging line
  
        const ordersData = response.data.orders.reduce((acc, order) => {
          acc[order.orderId] = order; // Make sure this key matches the actual orderId format
          return acc;
        }, {});
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
  
    fetchOrders();
  }, []);
  

  return (
    <div className="admin-container">
      {/* Dashboard on the left */}
      <div className="admin-dashboard">
        <Dash />
      </div>

      {/* Payment content */}
      <div className="admin-content">
        <div className="payment-card">
          <h1 className="payment-title">Payment Details</h1>

          <div className="table-wrapper">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Order ID</th>
                  {/* <th>Product Name</th> */}
                  <th>Payment ID</th>
                  <th>Amount (₹)</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
  {payments.map((payment) => {
    const order = orders[payment.orderId];

    if (!order) {
      console.log("Order not found for:", payment.orderId); // Debugging line
    }

    const productDetails = order?.cartItems?.length
      ? order.cartItems.map((item) => (
          <div key={item._id} className="product-info">
            <img src={`http://localhost:9000/${item.image}`} alt={item.name} className="product-image" />
            <span>{item.name}</span>
          </div>
        ))
      : "No product found";

    return (
      <tr key={payment._id}>
        <td>{payment.username}</td>
        <td>{payment._id}</td>
        {/* <td>{productDetails}</td> */}
        <td>{payment.paymentId}</td>
        <td className="amount-text">₹{payment.amount}</td>
        <td className={payment.status === "Success" ? "success-text" : "failed-text"}>
          {payment.status}
        </td>
        <td>{new Date(payment.createdAt).toLocaleString()}</td>
      </tr>
    );
  })}
</tbody>


            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentView;
