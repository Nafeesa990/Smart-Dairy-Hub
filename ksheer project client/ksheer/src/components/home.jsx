import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/full-removebg-preview.png";
import Navs from '../components/navs.jsx';
import { FiArrowRight } from "react-icons/fi";
import About from "./about.jsx";
import Contact from "./contact.jsx";
import Footer from "./footer.jsx";

const Home = () => {
  return (
    <div className="home-container" >
      <Navs/>
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />

        </div>
        <div className="home-text-section"  style={{ marginLeft: '70px' }}>
          <h1 style={{ fontSize: '50px' }} className="primary-heading">
          Indulge in Dairy Delights: Fresh, Creamy, and Always Delicious!
          </h1>
          <p className="primary-text">
            Healthy switcher chefs do all the prep work, like peeding, chopping
            & marinating, so you can cook a fresh food.
          </p>
          <a href="/Login" className="secondary-button">
  Order Now <FiArrowRight />
</a>

        </div>
        <div className="home-image-section">

          <img src={BannerImage} alt="" />
        </div>
      </div>
      {/* <About/> */}
      <Contact/>
      <Footer/>
    </div>
 
  );
};

export default Home;