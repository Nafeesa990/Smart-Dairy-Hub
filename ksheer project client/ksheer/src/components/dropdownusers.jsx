import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Navs from '../components/navs.jsx';
import BannerBackground from "../Assets/home-banner-background.png";

function Userslist() {
  return (
    <>
      <Navs />

      <div className="home-bannerImage-container">
        <img src={BannerBackground} alt="" />
      </div>

      <div className="p-5 d-flex justify-content-center">
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Select User Type
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="/Admin">Admin</Dropdown.Item>
            <Dropdown.Item href="/DashBoard">Farmer</Dropdown.Item>
            <Dropdown.Item href="/Login">Customer</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
}

export default Userslist;
