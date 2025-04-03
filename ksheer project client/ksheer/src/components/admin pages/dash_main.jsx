import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import '../../css/dash_main.css';

function Dash() {
    const navigate = useNavigate(); 
    const location = useLocation(); // ✅ Track current URL

    // Logout function
    const handleLogout = async () => {
        const token = localStorage.getItem("adminToken");

        try {
            const response = await fetch("http://localhost:9000/adminapi/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            // Clear session and cache
            localStorage.removeItem("adminToken");
            sessionStorage.clear();
            caches.keys().then((names) => {
                names.forEach((name) => caches.delete(name));
            });

            alert("Logout successful");
            window.location.href = "/admin"; 

        } catch (error) {
            console.error("Logout error:", error.message);
            alert("Error during logout. Try again later.");
        }
    };

    // Function to check if the current path is active
    const isActive = (path) => location.pathname === path ? 'active-link' : '';

    return (
        <Navbar className="custom-navbar" style={{ backgroundColor: '#ffbe0a', minHeight: '100vh' }}>
            <Container>
                <Nav className="flex-column" style={{ height: '100%' }}>
                    <Nav.Link href="/Dashl" className={`s ${isActive('/Dashl')}`}>DashBoard</Nav.Link>
                    <Nav.Link href="/Addproducts" className={`s5 ${isActive('/Addproducts')}`}>Add Products</Nav.Link>
                    <Nav.Link href="/Edit" className={`s4 ${isActive('/Edit')}`}>View Products</Nav.Link>
                    <Nav.Link href="/Form" className={`s ${isActive('/Form')}`}>Milk Quality</Nav.Link>
                    <Nav.Link href="/Verify" className={`s ${isActive('/Verify')}`}>Verify</Nav.Link>
                    <Nav.Link href="/View_Delivery" className={`s2 ${isActive('/View_Delivery')}`}>Delivery Details</Nav.Link>
                    <Nav.Link href="/View_Payment" className={`s3 ${isActive('/View_Payment')}`}>Payment Details</Nav.Link>
                    <Nav.Link href="/Feedback" className={`s4 ${isActive('/Feedback')}`}>Feedback</Nav.Link>

                    <div style={{ marginTop: 'auto', marginLeft: '40px' }}>
                        <Button variant="danger" onClick={handleLogout}>Logout</Button>
                    </div>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Dash;
