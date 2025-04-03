import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Importing back icon
import '../../css/auth.css'; // Importing CSS

function FarmerLogin() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setMessage('Please enter both email and password.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/farmer/login', formData);
            const { token, email, farmerId,username } = response.data;

            localStorage.setItem('farmerToken', token);
            localStorage.setItem('farmerEmail', email);
            localStorage.setItem('farmerId', farmerId);
            localStorage.setItem('farmername', username);

            setMessage('Login successful');
            navigate('/FarmerDash', { state: { farmerId } });

        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };
    

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Back Button */}
                <FaArrowLeft className="back-icon" onClick={() => navigate("/")} />

                <h2 className="auth-title">Farmer Login</h2>
                
                {message && <p className="auth-message">{message}</p>}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        required 
                        onChange={handleChange} 
                        className="auth-input"
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        required 
                        onChange={handleChange} 
                        className="auth-input"
                    />

                    <button type="submit" className="auth-button">Login</button>

                    <p className="auth-footer">
                        Don't have an account? <a href="/FarmerSignin">Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default FarmerLogin;
