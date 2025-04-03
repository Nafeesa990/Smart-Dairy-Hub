import React from 'react';
import { useLocation } from 'react-router-dom';

function PredictionResult() {
    const location = useLocation();
    const { formData, qualityCheck } = location.state || {};

    if (!formData || !qualityCheck) {
        return <p className="text-center text-red-600">No data available.</p>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-blue-700 mb-6">Milk Quality Check</h2>
                <p><strong>Farmer Name:</strong> {formData.farmerName}</p>
                {/* <p><strong>Farm Location:</strong> {formData.farmLocation}</p> */}
                <p><strong>Milk Quantity:</strong> {formData.milkQuantity} L</p>
                <p><strong>pH:</strong> {qualityCheck.pH}</p>
                <p><strong>Temperature:</strong> {qualityCheck.temperature}°C</p>
                <p><strong>Turbidity:</strong> {qualityCheck.turbidity}</p>
                <p><strong>Fat:</strong> {qualityCheck.fat}</p>
                <p><strong>Odor:</strong> {qualityCheck.odor}</p>
                <p><strong>Taste:</strong> {qualityCheck.taste}</p>
                <p><strong>Color:</strong> {qualityCheck.color}</p>
                <p><strong>Prediction:</strong> 
                    <span className={`font-semibold ml-2 
                        ${qualityCheck.prediction === "low" ? "text-red-600" :
                        qualityCheck.prediction === "medium" ? "text-yellow-600" :
                        "text-green-600"}`}>
                        {qualityCheck.prediction.charAt(0).toUpperCase() + qualityCheck.prediction.slice(1)}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default PredictionResult;
