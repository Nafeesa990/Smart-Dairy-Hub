import React from 'react';
import Dash from "./dash_main";
import { Link } from 'react-router-dom';
import '../../css/add_society.css';
import BannerBackground from "../../Assets/home-banner-background.png";

function View_messages() {
    return (

        <div>
        <div className="home-bannerImage-container">
        <img src={BannerBackground} alt="" />

      </div>

        <div>
            <Dash/>
            <h3><Link to="/Board">Society Members</Link></h3>
            <h3><Link to="/Display_supervisor">Supervisors</Link></h3>
            <h3><Link to="/Display_board">Board Members</Link></h3>
            <h4><Link to="/Display_board">Employees</Link></h4>
            <h4><Link to="/Display_board">Customers</Link></h4>
        </div>
        </div>
    );
}

export default View_messages;