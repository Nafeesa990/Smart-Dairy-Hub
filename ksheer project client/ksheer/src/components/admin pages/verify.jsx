import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dash from "./dash_main";
import "../../css/verify.css"; // Import the CSS file

function Verify() {
    const [farmers, setFarmers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPendingFarmers();
    }, []);

    const fetchPendingFarmers = async () => {
        try {
            const response = await axios.get('http://localhost:9000/admin/pending-farmers');
            setFarmers(response.data);
        } catch (error) {
            setMessage('Failed to load pending farmers');
        }
    };

    const approveFarmer = async (id) => {
        try {
            await axios.put(`http://localhost:9000/admin/approve-farmer/${id}`);
            setMessage('Farmer approved successfully');
            fetchPendingFarmers(); // Refresh the list
        } catch (error) {
            setMessage('Approval failed');
        }
    };

    const rejectFarmer = async (id) => {
        try {
            await axios.delete(`http://localhost:9000/admin/reject-farmer/${id}`);
            setMessage('Farmer rejected successfully');
            fetchPendingFarmers(); // Refresh the list
        } catch (error) {
            setMessage('Rejection failed');
        }
    };

    return (
        <div className="verify-container">
            <Dash />
            <h2 className="verify-title">Farmer Verification</h2>
            <div className="verify-box">
                {message && <p className="message">{message}</p>}
                {farmers.length > 0 ? (
                    <ul className="farmer-list">
                        {farmers.map((farmer) => (
                            <li key={farmer._id} className="farmer-item">
                                <div className="farmer-info">
                                    <strong>{farmer.username}</strong>
                                    <span>Email: {farmer.email}</span>
                                    <span>Contact: {farmer.contact}</span>
                                    <span>Address: {farmer.address}</span>
                                </div>
                                <div className="action-buttons">
                                    <button className="approve-btn" onClick={() => approveFarmer(farmer._id)}>Approve</button>
                                    <button className="reject-btn" onClick={() => rejectFarmer(farmer._id)}>Reject</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-farmers">No pending farmers</p>
                )}
            </div>
        </div>
    );
}

export default Verify;
