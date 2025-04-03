// DeliveryDashboard.js

import {React,useEffect} from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import "../../css/deliverydash.css";

function DeliveryDash() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("deliveryToken");
    if (!token) {
      // alert("Access denied. Please log in.");
      navigate("/Delivery");
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("deliveryToken");

    try {
      await fetch("http://localhost:9000/delivery/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("deliveryToken");
      // alert("Logged out successfully!");
      navigate("/Delivery");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out. Try again later.");
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>Delivery Dashboard</h2>
        <ul>
          <li>
            <Link to="/Orders">Orders</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default DeliveryDash;

