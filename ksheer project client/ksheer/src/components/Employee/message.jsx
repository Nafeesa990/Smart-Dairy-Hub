import React from 'react';
// import '../../css/employeecss/message.css'
import { Container,Row,Col,Button,Form} from 'react-bootstrap';
import { useState } from 'react';
import AXIOS from 'axios';

function Message() {
    const [res,setRes] = useState('');
    const [msg, setMsg]=useState('');
    const [sender, setSender]=useState('');
    const handler=(e)=>{
        e.preventDefault();
        const url="http://localhost:9000/msg/sendMsg"
        AXIOS.post(url,{res,msg,sender}).then((res)=>{
            alert(res.data)
        })
    }
    return (
        <div>
            <h1>send Message</h1>
            <Container>
            <Row className='justify-content-center mt-5'>
               <Col lg={6} className='p-1 '>
               <Form   onSubmit={handler}> 
                   <Form.Group>
                       <Form.Label>Receipient Name</Form.Label>
                       <Form.Control type='text' onChange={(e)=>setRes(e.target.value)} required></Form.Control>
                   </Form.Group>

                   <Form.Group>
                       <Form.Label>Message</Form.Label>
                       <Form.Control as='textarea' rows={3} onChange={(e)=>setMsg(e.target.value)} required></Form.Control>
                   </Form.Group>

                   <Form.Group>
                       <Form.Label>Sender Name</Form.Label>
                       <Form.Control type='text' onChange={(e)=>setSender(e.target.value)} required></Form.Control>
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

export default Message;