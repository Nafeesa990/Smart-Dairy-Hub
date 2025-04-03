import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dash from "./dash_main";
import '../../css/form.css';

function Form() {
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();

    // ✅ Fetch all forms along with QualityCheck status
    const fetchForms = async () => {
        try {
            const response = await axios.get('http://localhost:9000/farmer_form/all-forms');
            const formsData = response.data;

            // Fetch QualityCheck status for each form
            const updatedForms = await Promise.all(formsData.map(async (form) => {
                try {
                    const qualityResponse = await axios.get(`http://localhost:9000/quality_check/all/${form._id}`);
                    const qualityCheckData = qualityResponse.data.length > 0 ? qualityResponse.data[0] : null;
                    return { 
                        ...form, 
                        status: qualityCheckData ? qualityCheckData.status : 'Pending' 
                    };
                } catch (error) {
                    console.error(`❌ Error fetching quality check for form ${form._id}:`, error);
                    return { ...form, status: 'Pending' };
                }
            }));

            setForms(updatedForms);
        } catch (error) {
            console.error('❌ Error fetching forms:', error);
        }
    };

    useEffect(() => {
        fetchForms(); // Fetch data when component loads
    }, []);

    // ✅ Update Form Status (Accept/Reject)
    const updateFormStatus = async (formId, status) => {
        try {
            const response = await axios.put(
                `http://localhost:9000/quality_check/update-status/${formId}`, 
                { status: status }
            );

            if (response.status === 200) {
                fetchForms(); // Refresh UI
                console.log(`✅ Form ${formId} updated to:`, status);
            }
        } catch (error) {
            console.error(`❌ Error updating form status to ${status}:`, error);
        }
    };

    // ✅ Handle Payment
    const handlePayment = async (form) => {
        try {
            navigate('/AdminPay', { state: { formData: form, farmerName: form.farmerName } });

            fetchForms(); // Refresh UI
        } catch (error) {
            console.error("❌ Error processing payment:", error);
        }
    };

    // ✅ Handle View Details (with Quality Check Data)
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
        <div className="min-h-screen bg-gray-100 p-6">
            <Dash />
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Submitted Farmer Forms</h2>
                <div className="overflow-x-auto table-container">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-blue-600">
                            <tr>
                                <th className="p-3 border">Farmer Name</th>
                                {/* <th className="p-3 border">Farm Location</th> */}
                                <th className="p-3 border">Milk Quantity (L)</th>
                                <th className="p-3 border">Submitted At</th>
                                <th className="p-3 border">Quality Status</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forms.length > 0 ? (
                                forms.map((form, index) => (
                                    <tr 
                                        key={index} 
                                        className={`text-center ${
                                            form.status === 'rejected' || form.status === 'paid'
                                                ? 'bg-gray-300 opacity-50'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        <td className="p-3 border">{form.farmerName}</td>
                                        {/* <td className="p-3 border">{form.farmLocation}</td> */}
                                        <td className="p-3 border">{form.milkQuantity} L</td>
                                        <td className="p-3 border">{new Date(form.submittedAt).toLocaleString()}</td>

                                        {/* ✅ Quality Check + View Result Buttons (Disabled after Payment) */}
                                        <td className="p-3 border">
                                            <button 
                                                className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                onClick={() => navigate('/QualityCheck', { state: { formData: form } })}
                                                disabled={form.status === 'rejected' || form.status === 'paid'}
                                            >
                                                Check
                                            </button>

                                            <button 
                                                className="ml-2 px-4 py-2 bg-green-500 rounded-md hover:bg-green-700 disabled:opacity-50"
                                                onClick={() => handleViewDetails(form)}
                                                disabled={form.status === 'rejected' || form.status === 'paid'}
                                            >
                                                Result
                                            </button>
                                        </td>

                                        {/* ✅ Accept/Reject/Pay Button - PAID STATUS FIXED */}
                                        <td className="p-3 border">
                                            {form.status === 'paid' ? (
                                                <span className="text-green-700 font-bold">Paid</span>
                                            ) : form.status === 'accepted' ? (
                                                <button 
                                                    className="px-4 py-2 bg-yellow-500 rounded-md hover:bg-yellow-700 disabled:opacity-50"
                                                    onClick={() => handlePayment(form)}
                                                    disabled={form.status === 'paid'}
                                                >
                                                    Pay
                                                </button>
                                            ) : form.status === 'rejected' ? (
                                                <span className="text-red-600 font-bold">Rejected</span>
                                            ) : (
                                                <>
                                                    <button 
                                                        className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-700"
                                                        onClick={() => updateFormStatus(form._id, 'accepted')}
                                                    >
                                                        Accept
                                                    </button>

                                                    <button 
                                                        className="ml-2 px-4 py-2 bg-red-500 rounded-md hover:bg-red-700"
                                                        onClick={() => updateFormStatus(form._id, 'rejected')}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-3 border text-center text-gray-500">
                                        No forms submitted yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Form;
