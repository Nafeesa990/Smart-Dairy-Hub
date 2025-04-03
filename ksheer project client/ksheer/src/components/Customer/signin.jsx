import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import { FaArrowLeft } from 'react-icons/fa'; // Import back icon
import axios from 'axios';
import '../../css/cussignin.css';
// import Navs from '../navs';
import BannerBackground from "../../Assets/home-banner-background.png";

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();  // Initialize navigate function

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/customer/signup', formData);
            setMessage(response.data);  // Show success message
        } catch (error) {
            setMessage(error.response?.data || 'Signup failed');
        }
    };

    return (
        <div>
            {/* <Navs /> */}
            <div className="home-bannerImage-container">
                <img src={BannerBackground} alt="" />
            </div>
            <button onClick={() => navigate('/')} className="back-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
                <FaArrowLeft /> Back
            </button> {/* Back Button with Icon at Upper Side */}
            <div className="auth-container">
                <h2>Customer Sign Up</h2>
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Full Name" required onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <span><a href="/Login">Login</a></span></p>
            </div>
        </div>
    );
}

export default Signup;