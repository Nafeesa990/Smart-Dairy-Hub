import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/submitted_form.css';

function SubmittedForms() {
    const location = useLocation();
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!location.state?.farmerId) return;

        const fetchForms = async () => {
            try {
                const response = await axios.get('http://localhost:9000/farmer_form/all-forms');
                const allForms = response.data;

                const filteredForms = allForms.filter(form => form.farmerId === location.state?.farmerId);

                // ✅ Fetch Status for each form
                const updatedForms = await Promise.all(filteredForms.map(async (form) => {
                    try {
                        const statusResponse = await axios.get(`http://localhost:9000/quality_check/status/${form._id}`);
                        return { 
                            ...form, 
                            status: statusResponse.data.status || 'Pending',
                            amount: statusResponse.data.amount || 0
                        };
                    } catch {
                        return { ...form, status: 'Pending', amount: 0 };
                    }
                }));

                setForms(updatedForms);
            } catch (error) {
                console.error('❌ Error fetching forms:', error);
                setError('Failed to load forms. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
    }, [location.state]);

    const handleViewDetails = async (form) => {
        try {
            const response = await axios.get(`http://localhost:9000/quality_check/all/${form._id}`);
            const qualityCheckData = response.data.length > 0 ? response.data[0] : null;
            navigate('/PredictionResult', { state: { formData: form, qualityCheck: qualityCheckData } });
        } catch (error) {
            console.error("❌ Error fetching quality check details:", error);
            navigate('/PredictionResult', { state: { formData: form, qualityCheck: null } });
        }
    };

    return (
        <div className="submitted-forms-container">
            <h2 className="submitted-forms-title">Submitted Forms</h2>

            {loading ? (
                <p>Loading forms...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : forms.length === 0 ? (
                <p>No submitted forms found.</p>
            ) : (
                <table className="submitted-forms-table">
                    <thead>
                        <tr>
                            {/* <th>Farm Location</th> */}
                            <th>Milk Quantity</th>
                            <th>Submitted On</th>
                            <th>Quality</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.map((form, index) => (
                            <tr key={index} className={form.status === 'rejected' ? 'disabled-row' : ''}>
                                {/* <td>{form.farmLocation}</td> */}
                                <td>{form.milkQuantity} Liters</td>
                                <td>{new Date(form.submittedAt).toLocaleString()}</td>
                                <td><button onClick={() => handleViewDetails(form)}>View</button></td>
                                <td>
                                    {form.status === 'paid' ? (
                                        <span className="paid-status">✅ Paid - ₹{form.paymentAmount}</span>
                                    ) : form.status === 'rejected' ? (
                                        <span className="rejected-status">❌ Rejected</span>
                                    ) : form.status === 'accepted' ? (
                                        <span className="accepted-status">✔ Accepted</span>
                                    ) : (
                                        <span className="pending-status">⏳ Pending</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button className="back-button" onClick={() => navigate('/FarmerDash')}>
                🔙 Back to Dashboard
            </button>
        </div>
    );
}

export default SubmittedForms;
