import { Container,Form ,Row,Col,Button} from "react-bootstrap";
import Dash from "./admin pages/dash_main";
import '../css/add_society.css'
import React, { useState } from 'react';
import BannerBackground from "../Assets/home-banner-background.png";
import AXIOS from 'axios';

function Add_society()  {
    const [name,setName]=useState("");
    const [phone,setPhone]=useState("");
    // const [num,setNum]=useState("");
    const [area,setArea]=useState("");
    const [image,setImage]=useState("");
    const formdata=new FormData();
    const handler=(e)=>{
        e.preventDefault();
        formdata.append('name',name);
        formdata.append('phone',phone);
        // formdata.append('num',num);
        formdata.append('area',area);
        formdata.append('image',image)
        const url="http://localhost:9000/apid/societyregupload"
        AXIOS.post(url,formdata,{'context':'multipart/form-data'}).then((res)=>{
            alert(res.data)
        })
        
    }
    return (
          <div>
        <div className="home-bannerImage-container">
        <img src={BannerBackground} alt="" />

      </div>

        <div>
            <Dash/>
            <Container>
                <Row>
                    <Col>
                    <h2 className='text-center' style={{paddingTop:'40px',paddingLeft:'100px'}}>Milk Quality Prediction Form</h2>
                    </Col>
                </Row>
                {/* <Row className='justify-content-center ' style={{paddingTop:'50px',paddingLeft:'150px' }}>
                    <Col lg={8} className='border p-4'>
                        <Form encType="multipart/form-data" onSubmit={handler}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' onChange={(e)=>setName(e.target.value)} required></Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>PhoneNo.</Form.Label>
                        <Form.Control type='number' onChange={(e)=>setPhone(e.target.value)} required></Form.Control>
                    </Form.Group>

                    

                    <Form.Group>
                        <Form.Label> Area</Form.Label>
                        <Form.Control type='text' onChange={(e)=>setArea(e.target.value)} required></Form.Control>
                    </Form.Group>

                    <Form.Group style={{marginBottom:'20px'}}>
                        <Form.Label>Photo</Form.Label>
                        <Form.Control  type='file' required></Form.Control>
                    </Form.Group>onChange={(e)=>setImage(e.target.files[0])}

                    <Form.Group>
                        <Button type="Submit">Add</Button>
                    </Form.Group>
                    </Form>
                    </Col>
                </Row> */}
            </Container>
        </div>
        </div>
    );
}

export default Add_society;