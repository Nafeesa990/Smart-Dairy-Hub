import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Dash from './dashcustomer';
import AXIOS from 'axios';
import '../../css/cusproduct.css';

function CusProduct() {
    const [display, setDisplay] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        AXIOS.get("http://localhost:9000/up/productview").then((res) => {
            setDisplay(res.data.result);
        });
    }, []);

    const handleViewMore = (product) => {
        navigate("/ViewMore", { state: { product } });
    };

    return (
        <div>
            <Dash />
            <h2 className="product-heading">Dairy Products</h2>
            <div className="product-container">
                {display.map((ls) => (
                    <div className="product-card" key={ls._id}>
                        <img className="product-img" src={`http://localhost:9000/${ls.filepath}`} alt="Products" />
                        <div className="product-body">
                            <h3 className="product-title">{ls.name}</h3>
                            <p className="product-text">
                                {ls.des.length > 60 ? ls.des.substring(0, 60) + '...' : ls.des}
                            </p>
                            <p className="product-text">Rs.{ls.price}</p>
                            <button className="product-button" onClick={() => handleViewMore(ls)}>View More</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CusProduct;
