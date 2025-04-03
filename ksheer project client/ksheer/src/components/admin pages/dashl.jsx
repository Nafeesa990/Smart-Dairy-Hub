import React, { useState, useEffect } from 'react';
import '../../css/add_society.css';
import Dash from "./dash_main";

function Dashl() {
    const [userCounts, setUserCounts] = useState({
        totalCustomers: 0,
        totalFarmers: 0,
        totalUsers: 0,
    });

    useEffect(() => {
        fetch('http://localhost:9000/counts/getUserCounts') // Ensure the correct API URL
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Data:", data); // Debugging - check in console
                setUserCounts({
                    totalCustomers: data.totalCustomers,
                    totalFarmers: data.totalFarmers,
                    totalUsers: data.totalUsers, // Already calculated in API
                });
            })
            .catch(error => console.error("Error fetching user counts:", error));
    }, []); // Runs once when component mounts

    return (
        <div className="admin-dashboard">
            <Dash />
            <h1 className="dashboard-title">Admin Dashboard</h1>

            <div className="dashboard-content">
                <div className="dashboard-card shadow-lg p-4">
                    <h2>Total Customers</h2>
                    <p>{userCounts.totalCustomers}</p>
                </div>
                <div className="dashboard-card shadow-lg p-4">
                    <h2>Total Users</h2>
                    <p>{userCounts.totalUsers}</p>
                </div>
                <div className="dashboard-card shadow-lg p-4">
                    <h2>Total Farmers</h2>
                    <p>{userCounts.totalFarmers}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashl;
