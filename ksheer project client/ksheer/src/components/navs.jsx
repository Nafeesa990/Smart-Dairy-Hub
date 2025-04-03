/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import '../css/navs.css';
import logo from "../Assets/logo.png";
import { BsCart2 } from "react-icons/bs";
import { Dropdown, Button, Modal } from "react-bootstrap";
import { HiOutlineBars3 } from "react-icons/hi2";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuOpen = () => setShowMenu(true);
  const handleMenuClose = () => setShowMenu(false);

  const menuOptions = [
    { text: "Home", link: "/" },
    { text: "Users", link: "/Admin" },
    { text: "Contact", link: "/contact" },
    { text: "Products", link: "/Displayproducts" },
    { text: "Cart", link: "/cart" },
  ];

  return (
    <nav style={{ backgroundColor: "" }}>
      <div className="nav-logo-container">
        <img
          src={logo}
          alt="logo"
          style={{ width: "100px", height: "auto", paddingLeft: "35%" }}
        />
      </div>

      <div
        className="navbar-links-container"
        style={{ display: "flex", alignItems: "center", gap: "15px" }}
      >
        <a href="/" className="font">Home</a>

        {/* Users Dropdown */}
        <Dropdown>
        <Dropdown.Toggle
  variant="light"
  id="dropdown-basic"
  className="font"
  style={{ border: "none", outline: "none" }}
>
  Users
</Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="/Admin">Admin</Dropdown.Item>
            <Dropdown.Item href="/FarmerSignin">Farmer</Dropdown.Item>
            <Dropdown.Item href="/SignIn">Customer</Dropdown.Item>
            <Dropdown.Item href="/Delivery">Delivery Agent</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <a href="/contact" className="font">Contact</a>

        <a href="/Displayproducts" className="font">
          <BsCart2 className="navbar-cart-icon" /> Products
        </a>
      </div>

      {/* Menu Icon */}
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={handleMenuOpen} />
      </div>

      {/* Bootstrap Modal for Menu */}
      <Modal show={showMenu} onHide={handleMenuClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {menuOptions.map((item) => (
            <Button
              key={item.text}
              variant="light"
              className="w-100 text-start mb-2"
              onClick={() => {
                handleMenuClose();
                window.location.href = item.link;
              }}
            >
              {item.text}
            </Button>
          ))}
        </Modal.Body>
      </Modal>
    </nav>
  );
};

export default Navbar;
