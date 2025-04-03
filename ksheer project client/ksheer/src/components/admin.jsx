import React, { useState } from 'react';
import image1 from '../images/green.png';
import '../css/admin.css';
import { Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Navs from '../components/navs.jsx';

function Admin() {
    const [uname, setUname] = useState("");
    const [passw, setPassw] = useState("");
    const navigate = useNavigate();

    const handler = async (e) => {
        e.preventDefault(); // Prevent form reload
    
        try {
            const response = await fetch("http://localhost:9000/adminapi/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: uname,
                    password: passw,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }
    
            // Store token and userId in localStorage
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminUserId", data.userId); // Store userId
    
            alert("Login successful");
            navigate("/Dashl");
    
        } catch (error) {
            console.error("Error logging in:", error.message);
            alert("Error logging in. Try again later.");
        }
    };
    

    return (
        <div className="admin-container">
            <Navs />
            <div className="login-card">
                <h2>Admin Login</h2>
                <Form onSubmit={handler}>
                    <div className="input-container">
                        <input
                            type='text'
                            placeholder='Username'
                            className='input-field'
                            onChange={(e) => setUname(e.target.value)}
                            value={uname}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <input
                            type='password'
                            placeholder='Password'
                            className='input-field'
                            onChange={(e) => setPassw(e.target.value)}
                            value={passw}
                            required
                        />
                    </div>

                    <button type='submit' className='login-btn'>Login</button>
                    {/* <img src={} alt="Admin" className="login-image" /> */}
                </Form>
            </div>
        </div>
    );
}

export default Admin;
