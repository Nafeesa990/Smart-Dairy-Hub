import React, { useState } from 'react';
import '../../css/cuslogin.css';
// import Navs from '../navs';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Import back icon

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:9000/customer/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
            console.log(email)
    
            if (response.ok) {
                localStorage.setItem('customer', JSON.stringify(data.customer));  // ✅ Store customer details
                localStorage.setItem('userId', data.customer._id); 
                localStorage.setItem('username', data.customer.username);
                navigate('/CusProduct');  // ✅ Navigate to dashboard
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Something went wrong');
        }
    };
    

    return (
        <div className="login-page">
            {/* <Navs/> */}
            <button onClick={() => navigate('/')} className="back-button">
                <FaArrowLeft /> Back
            </button> {/* Back Button with Icon at Top */}
            <div className="auth-container">
                <h2>Customer Login</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="input-field"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="input-field"
                    />
                    <button type="submit" className="login-button">Login</button>
                    <p className="signup-link">Don't have an account? <span onClick={() => navigate('/SignIn')}>Sign Up</span></p>
                </form>
            </div>
        </div>
    );
}

export default Login;
