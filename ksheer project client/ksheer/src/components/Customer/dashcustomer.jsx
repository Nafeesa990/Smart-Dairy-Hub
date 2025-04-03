import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar, Button, Card } from 'react-bootstrap';
import '../../css/customer.css';

function Dash() {
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCustomer = localStorage.getItem('customer');
        if (!storedCustomer) {
            navigate('/login');
        } else {
            setCustomer(JSON.parse(storedCustomer));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('customer');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            {customer ? (
                <>
                    <Navbar expand="lg" className="custom-navbar">
                        <Container>
                            <Navbar.Brand className="brand-text">Welcome, {customer.username}!</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="ms-auto align-items-center">
                                    <Nav className="dashboard-links ms-4">
                                        <NavLink to="/CusProduct" className='nav-link-custom'>Products</NavLink>
                                        <NavLink to="/Cart" className='nav-link-custom'>Cart</NavLink>
                                        <NavLink to="/Order" className='nav-link-custom'>Orders</NavLink>
                                        {/* <NavLink to="/Feedback" className='nav-link-custom'>Feedback</NavLink> */}
                                    </Nav>
                                    <Button variant="outline-light" onClick={handleLogout} className="logout-btn ms-4">Logout</Button>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>

                    {/* <Container className="dashboard-content">
                        <Card className="info-card">
                            <Card.Body>
                                <Card.Title>Dashboard Overview</Card.Title>
                                <Card.Text>
                                    Manage your profile, check notifications, and explore services.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Container> */}
                </>
            ) : (
                <h2 className="loading-text">Loading...</h2>
            )}
        </div>
    );
}

export default Dash;