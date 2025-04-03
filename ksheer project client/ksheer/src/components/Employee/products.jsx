import React, { useState } from 'react';
import Dashemployee from './dashboardemployee';
import '../../css/employeecss/products.css';
import { Container,Row,Col,Button,Form } from 'react-bootstrap';
import AXIOS from 'axios';

function Products(props) {
    const[name,setName]=useState('');
    const[des,setDes]=useState('');
    const[price,setPrice]=useState('');
    const[image,setImage]=useState('');
    const formdata=new FormData();
    const handler=(e)=>{
            e.preventDefault();
            formdata.append('name',name);
            formdata.append('des',des);
            formdata.append('price',price);
            formdata.append('image',image);
            const url="http://localhost:9000/up/productupload"
            AXIOS.post(url,formdata,{'context':'multipart/form-data'}).then((res)=>{
                alert(res.data)
            })
    }
    return (
        <div>
            <Dashemployee/>
            <h1>Product add page..........</h1>
            <Container>
                 <Row className='justify-content-center mt-5'>
                    <Col lg={6} className='p-1 '>
                    <Form  encType="multipart/form-data" onSubmit={handler}> 
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='text' onChange={(e)=>setName(e.target.value)} required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type='textfield' onChange={(e)=>setDes(e.target.value)} required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type='number' onChange={(e)=>setPrice(e.target.value)} required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type='file' onChange={(e)=>setImage(e.target.files[0])} required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Button  variant="primary" type="upload" >Submit</Button>
                        </Form.Group>
                    </Form>
                    </Col>
                 </Row>
            </Container>

        </div>
    );
}

export default Products;