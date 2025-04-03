import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/farmer_dash.css';

function FarmerDashboard() {
    const [email, setEmail] = useState('');
    const [farmerId, setFarmerId] = useState('');
    const [activeTab, setActiveTab] = useState('myForms');
    const [forms, setForms] = useState([]);
    const [payments, setPayments] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('farmerToken');
        const userEmail = localStorage.getItem('farmerEmail');
        const storedFarmerId = localStorage.getItem('farmerId') || '';
        

        if (!farmerId && storedFarmerId) {
            setFarmerId(storedFarmerId);
        }

        if (!token) {
            navigate('/FarmerLogin');
            return;
        }

        setEmail(userEmail || 'Unknown Farmer');

        try {
            setForms(JSON.parse(localStorage.getItem('farmerForms')) || []);
        } catch {
            setForms([]);
        }

        try {
            setPayments(JSON.parse(localStorage.getItem('farmerPayments')) || []);
        } catch {
            setPayments([]);
        }
    }, [location, navigate, farmerId]);

    const handleLogout = () => {
        localStorage.removeItem('farmerToken');
        localStorage.removeItem('farmerEmail');
        localStorage.removeItem('farmerId');
        navigate('/FarmerLogin');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h2 className="dashboard-title">Farmer Dashboard</h2>
                <p className="welcome-message">Welcome, {email}!</p>

                <div className="dashboard-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'myForms' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('myForms')}
                    >
                        My Forms
                    </button>
                    {/* 
                     */}
                </div>

                <div className="dashboard-content">
                    {activeTab === 'myForms' && (
                        <div>
                            <h3 className="section-title">My Submitted Forms</h3>
                            
                            <button 
                                className="go-to-form-button" 
                                onClick={() => navigate('/FarmerForm', { state: { farmerId } })}
                            >
                                ➕ Fill New Form
                            </button>
                            
                            <button 
                                className="view-forms-button" 
                                onClick={() => navigate('/SubmittedForm', { state: { farmerId } })}
                            >
                                📄 View Submitted Forms
                            </button>
                            <ul className="history-list">
                              
                            </ul>
                        </div>
                    )}

                    {/* {activeTab === 'payment' && (
                        <div>
                            <h3 className="section-title">Check Payment Status</h3>
                            
                        </div>
                    )} */}

                    {/* {activeTab === 'paymentHistory' && (
                        <div>
                            <h3 className="section-title">Payment History</h3>
                           
                        </div>
                    )} */}

                    {/* {activeTab === 'account' && (
                        <div>
                            <h3 className="section-title">Account Details</h3>
                            <p>Provide your bank account details so that the admin can send you payments.</p>
                            <button 
                                className="add-account-button" 
                                onClick={() => navigate('/BankDetails', { state: { farmerId } })}
                            >
                                ➕ Add/Update Account Details
                            </button>
                        </div>
                    )} */}
                </div>

                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default FarmerDashboard;
