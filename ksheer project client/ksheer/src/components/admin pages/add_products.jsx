import React, { useState } from 'react';
import '../../css/add_society.css';
import Dash from "./dash_main";
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import BannerBackground from "../../Assets/home-banner-background.png";
import AXIOS from 'axios';

function Products(props) {
    const [name, setName] = useState('');
    const [des, setDes] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const formdata = new FormData();

    const handler = (e) => {
        e.preventDefault();
        formdata.append('name', name);
        formdata.append('des', des);
        formdata.append('price', price);
        formdata.append('image', image);
        const url = "http://localhost:9000/up/productupload";
        AXIOS.post(url, formdata, { 'context': 'multipart/form-data' }).then((res) => {
            alert(res.data);
        });
    };

    return (
        <div>
            {/* Background Image */}
            <div className="home-bannerImage-container">
                <img src={BannerBackground} alt="" />
            </div>

            <div>
                <Dash />
                <h1 style={{ textAlign: 'center', padding: '20px 0', fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
                    Upload Products
                </h1>

                <Container>
                    <Row className="justify-content-center mt-5">
                        <Col lg={6}>
                            <Card className="shadow-lg p-4" style={{ borderRadius: '12px', border: 'none' }}>
                                <Card.Body>
                                    <Form encType="multipart/form-data" onSubmit={handler}>
                                        <Form.Group>
                                            <Form.Label className="font-weight-bold">Product Name</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                onChange={(e) => setName(e.target.value)} 
                                                required 
                                                placeholder="Enter product name" 
                                                className="rounded"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mt-3">
                                            <Form.Label className="font-weight-bold">Description</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={3} 
                                                onChange={(e) => setDes(e.target.value)} 
                                                required 
                                                placeholder="Enter product description" 
                                                className="rounded"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mt-3">
                                            <Form.Label className="font-weight-bold">Price</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                onChange={(e) => setPrice(e.target.value)} 
                                                required 
                                                placeholder="Enter price" 
                                                className="rounded"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mt-3">
                                            <Form.Label className="font-weight-bold">Image</Form.Label>
                                            <Form.Control 
                                                type="file" 
                                                onChange={(e) => setImage(e.target.files[0])} 
                                                required 
                                                className="rounded"
                                            />
                                        </Form.Group>

                                        <Button 
                                            variant="warning" 
                                            type="submit" 
                                            className="w-100 mt-4 rounded"
                                            style={{ fontSize: "1rem", fontWeight: "bold", marginLeft: "-40px",marginBottom: "-20px" }}>
                                            Submit
                                        </Button>

                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default Products;
