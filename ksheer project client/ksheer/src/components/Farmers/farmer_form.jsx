import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/farmer_form.css'; // Importing CSS
import { FaArrowLeft } from 'react-icons/fa'; // Importing back icon

function FarmerForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const [farmerId, setFarmerId] = useState('');
    const [farmerName, setFarmerName] = useState('');
    const [farmLocation, setFarmLocation] = useState('');
    const [milkQuantity, setMilkQuantity] = useState('');

    useEffect(() => {
        // Get farmerId from state or session storage
        let idFromState = location.state?.farmerId || null;
        let idFromStorage = sessionStorage.getItem('farmerId') || null;

        if (idFromState) {
            setFarmerId(idFromState);
            sessionStorage.setItem('farmerId', idFromState);
        } else if (idFromStorage) {
            setFarmerId(idFromStorage);
        } else {
            console.error("Farmer ID is missing!");
        }

        // Auto-fill farmerName from localStorage
        const storedName = localStorage.getItem('farmername');
        if (storedName) {
            setFarmerName(storedName);
        }
    }, [location]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!farmerId) {
            alert('Error: Farmer ID is missing. Please log in again.');
            return;
        }

        const newFormData = { farmerId, farmerName, farmLocation, milkQuantity };

        try {
            const response = await fetch('http://localhost:9000/farmer_form/submit-form', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('farmerToken')}` 
                },
                body: JSON.stringify(newFormData)
            });

            if (response.ok) {
                alert('✅ Form submitted successfully!');
                
                const updatedForms = [...(JSON.parse(localStorage.getItem('farmerForms')) || []), newFormData];
                localStorage.setItem('farmerForms', JSON.stringify(updatedForms));

                navigate('/FarmerDash');
            } else {
                const errorMessage = await response.json();
                alert(`⚠️ Error submitting form: ${errorMessage.error}`);
            }
        } catch (error) {
            console.error('❌ Submission error:', error);
            alert('Server error. Please try again later.');
        }
    };

    return (
        <div className="form-container">
            {/* Back Button */}
            <FaArrowLeft className="back-icon" onClick={() => navigate('/FarmerDash')} />

            <h2 className="form-title">Milk Details</h2>

            <form className="farmer-form" onSubmit={handleSubmit}>
                {/* Auto-filled and disabled Name field */}
                <label>Name:</label>
                <input type="text" value={farmerName} disabled />

                {/* <label>Farm Location:</label>
                <input type="text" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} required /> */}

                <label>Milk Quantity (Liters):</label>
                <input type="number" value={milkQuantity} onChange={(e) => setMilkQuantity(e.target.value)} required />

                <button type="submit" className="form-button">Submit</button>
            </form>
        </div>
    );
}

export default FarmerForm;
