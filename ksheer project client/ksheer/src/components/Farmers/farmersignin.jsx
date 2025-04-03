import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';  // Importing back icon
import '../../css/auth.css';

function FarmerSignin() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:9000/farmer/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, contact, address })
            });
            const data = await response.json();
            console.log("Response Data:", data);

            if (response.ok) {
                setMessage('Signup successful! Please wait for admin approval.');
                setTimeout(() => navigate('/FarmerSignin'), 3000);
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('Something went wrong');
        }
    };

    return (
        <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="auth-card" style={{ width: '400px' }}>
                {/* Back Button (Small Icon) */}
                <FaArrowLeft className="back-icon" onClick={() => navigate(-1)} />

                <h2 className="auth-title">Farmer Sign Up</h2>

                {message && <p className="text-green-500 text-center">{message}</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        required 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="auth-input"
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="auth-input"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="auth-input"
                    />
                    <input 
                        type="text" 
                        placeholder="Contact" 
                        required 
                        value={contact} 
                        onChange={(e) => setContact(e.target.value)} 
                        className="auth-input"
                    />
                    <input 
                        type="text" 
                        placeholder="Address" 
                        required 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className="auth-input"
                    />

                    <button type="submit" className="auth-button">Sign Up</button>

                    <p>Already have an account? <span><a href="/FarmerLogin">Login</a></span></p>
                </form>
            </div>
        </div>
    );
}

export default FarmerSignin;