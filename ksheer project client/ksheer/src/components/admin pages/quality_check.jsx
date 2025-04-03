import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaFlask, FaThermometerHalf, FaTint, FaPalette, FaRegSmile, FaRegLaugh, FaRegGrin } from 'react-icons/fa';
import '../../css/qualitycheck.css';

function QualityCheck() {
    const navigate = useNavigate();
    const location = useLocation();
    const { formData } = location.state || {};
    const farmerFormId = formData?._id;

    const [qualityData, setQualityData] = useState({
        pH: '',
        temperature: '',
        turbidity: '',
        color: '',
        fat: '',
        taste: '',
        odor: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate numeric fields (pH, temperature, turbidity, fat)
        const numericFields = ['pH', 'temperature', 'turbidity', 'fat'];
        if (numericFields.includes(name) && !/^\d*\.?\d*$/.test(value)) {
            return; // Only allow valid numbers
        }

        setQualityData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!farmerFormId) {
            setError('FarmerForm ID is missing. Cannot submit quality check.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/quality_check/submit', {
                farmerFormId,
                ...qualityData
            });

            alert(`Quality check submitted successfully!\nPrediction: ${response.data.prediction}`);

            // Reset form
            setQualityData({
                pH: '',
                temperature: '',
                turbidity: '',
                color: '',
                fat: '',
                taste: '',
                odor: ''
            });

            navigate('/Form', { state: { prediction: response.data.prediction } });
        } catch (error) {
            console.error('❌ Error submitting quality check:', error);
            setError('Failed to submit quality check. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (!loading) navigate(-1);
    };

    const fieldIcons = {
        pH: <FaFlask />,
        temperature: <FaThermometerHalf />,
        turbidity: <FaTint />,
        color: <FaPalette />,
        fat: <FaRegSmile />,
        taste: <FaRegLaugh />,
        odor: <FaRegGrin />
    };

    return (
        <div className="quality-check-container">
            <div className="form-box">
                <button className={`back-btn ${loading ? 'disabled' : ''}`} onClick={handleBack}>
                    <FaArrowLeft /> Back
                </button>
                <h2 className="form-title">Quality Check Form</h2>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="quality-form">
                    <div className="form-grid">
                        {Object.keys(qualityData).map((field) => (
                            <div key={field} className="input-group">
                                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <div className="input-box">
                                    <span className="input-icon">{fieldIcons[field]}</span>
                                    <input
                                        type="text"
                                        name={field}
                                        value={qualityData[field]}
                                        onChange={handleChange}
                                        required
                                        placeholder={`Enter ${field}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="submit" disabled={loading} className={`submit-btn ${loading ? 'disabled' : ''}`}>
                        {loading ? 'Processing...' : 'Submit Quality Check'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default QualityCheck;
