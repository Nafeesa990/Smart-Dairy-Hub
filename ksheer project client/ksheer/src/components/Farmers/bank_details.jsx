import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/bank_details.css'; // Make sure to create this CSS file

function BankDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const farmerId = location.state?.farmerId || '';

    const [bankDetails, setBankDetails] = useState({
        accountHolder: '',
        accountNumber: '',
        ifscCode: '',
        bankName: ''
    });

    const handleChange = (e) => {
        setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:9000/bank-details/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ farmerId, ...bankDetails })
            });
    
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                navigate('/FarmerDash');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <div className="bank-details-container">
            <div className="bank-details-card">
                <h2>🏦 Add Bank Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Account Holder Name:</label>
                        <input type="text" name="accountHolder" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Account Number:</label>
                        <input type="text" name="accountNumber" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>IFSC Code:</label>
                        <input type="text" name="ifscCode" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Bank Name:</label>
                        <input type="text" name="bankName" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="save-button">Save Details</button>
                </form>
            </div>
        </div>
    );
}

export default BankDetails;
