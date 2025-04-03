import React, { useState, useEffect } from 'react';
import AXIOS from 'axios';
import Dash from "./dash_main";
import '../../css/add_society.css';

function Displayboardmem() {
    const [upload, setUpload] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = "http://localhost:9000/board/allboardmembers";
                const response = await AXIOS.get(url);
                console.log("Response:", response.data); // Log response data
                setUpload(response.data.result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='ta'>
            <Dash />
            <h2 className="text-center">BoardMembers details......</h2>

            <div className="text-right pr-3">
                <table className="table table-info">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Place</th>
                            <th>Contact</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upload.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.place}</td>
                                <td>{item.contact}</td>
                                <td>
                                    <img src={`http://localhost:9000/${item.filepath}`} alt="Person" width="100" height="100" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Displayboardmem;



