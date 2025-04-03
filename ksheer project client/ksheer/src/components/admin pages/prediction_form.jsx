import React, { useState } from 'react';
import axios from 'axios';

function MilkQualityForm() {
    const [formData, setFormData] = useState({
        ph: '',
        temperature: '',
        taste: '',
        turbidity: '',
        odor: '',
        fat: '',
        color: ''
    });

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:9000/predict_milk_quality', formData);
            setPrediction(response.data.grade);
        } catch (error) {
            console.error('❌ Error predicting milk quality:', error);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Milk Quality Prediction</h2>
            <form onSubmit={handleSubmit}>
                {['ph', 'temperature', 'taste', 'turbidity', 'odor', 'fat', 'color'].map((feature) => (
                    <div key={feature} className="mb-3">
                        <label className="block text-gray-700">{feature.charAt(0).toUpperCase() + feature.slice(1)}:</label>
                        <input
                            type="text"
                            name={feature}
                            value={formData[feature]}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                ))}
                <button 
                    type="submit" 
                    className="w-full bg-blue-600  py-2 rounded-md hover:bg-blue-800"
                    disabled={loading}
                >
                    {loading ? 'Predicting...' : 'Predict Quality'}
                </button>
            </form>

            {prediction && (
                <div className="mt-4 p-3 text-center bg-gray-200 rounded-md">
                    <strong>Predicted Milk Quality:</strong> <span className="text-xl font-bold">{prediction}</span>
                </div>
            )}
        </div>
    );
}

export default MilkQualityForm;
