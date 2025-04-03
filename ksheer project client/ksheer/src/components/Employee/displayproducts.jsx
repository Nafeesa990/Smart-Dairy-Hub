import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AXIOS from 'axios';
import '../../css/products.css';
import BannerBackground from "../../Assets/home-banner-background.png";

function Displayproducts() {
  const [display, setDisplay] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = "http://localhost:9000/up/productview";
    AXIOS.get(url).then((res) => {
      setDisplay(res.data.result);
    });
  }, []);

  // Capitalize the first letter of both the first and second words
  const formatHeading = (text) => {
    const words = text.split(" ");
    if (words.length >= 2) {
      return `${words[0][0].toUpperCase()}${words[0].slice(1)} ${words[1][0].toUpperCase()}${words[1].slice(1)}`;
    }
    return `${text[0].toUpperCase()}${text.slice(1)}`;
  };

  const handleViewMore = (product) => {
    alert("Signup to buy top notch products!");
  };

  return (
    <div>
      <div className="home-bannerImage-container">
        <img src={BannerBackground} alt="Banner" />
      </div>

      <h2 className="product-heading">Dairy Products</h2>

      <div className="product-container">
        {display.map((ls) => (
          <div key={ls._id} className="product-card">
            <img
              className="product-img"
              src={`http://localhost:9000/${ls.filepath}`}
              alt="Products"
            />

            <div className="product-body">
              <h3 className="product-title">{formatHeading(ls.name)}</h3>

              <p className="product-text">
                {ls.des.slice(0, 100)}{ls.des.length > 100 ? "..." : ""}
              </p>

              <p className="product-text">Rs. {ls.price}</p>

              <button
                className="product-button"
                onClick={() => handleViewMore(ls)}
              >
                View More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Displayproducts;
