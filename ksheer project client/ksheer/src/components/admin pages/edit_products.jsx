import Button from 'react-bootstrap/Button';
import '../../css/edit_products.css';
import BannerBackground from "../../Assets/home-banner-background.png";
import { useState, useEffect } from 'react';
import AXIOS from 'axios';
import EditForm from './editform';
import Dash from "./dash_main";

function Edit() {
  const [display, setDisplay] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const url = "http://localhost:9000/up/productview";
    const res = await AXIOS.get(url);
    setDisplay(res.data.result);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await AXIOS.delete(`http://localhost:9000/up/productdelete/${id}`);
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh product list after deletion
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };
  

  return (
    <div style={{ overflowY: "auto", maxHeight: "90vh" }}>
      <Dash />
      <div className="home-bannerImage-container">
        <img src={BannerBackground} alt="" />
      </div>
      <h2
  className="product-heading"
  style={{
    position: "fixed",
    top: "0",
    left: "50%",
    transform: "translateX(-50%)",
    
    padding: "10px 20px",
    width: "100%",
    textAlign: "center",
    
    zIndex: "1000",
  }}
>
  Dairy Products
</h2>

      
     
  <table
    className="product-table"
    style={{
      borderCollapse: "collapse",
      width: "70%",
      border: "1px solid black",
      marginLeft: "25%",
      marginTop: "70px"
    }}
  >
        <thead  style={{
        position: "sticky",
        top: "0",
        backgroundColor:"#cc9900",
        color: "white",
        zIndex: "10",
      }}>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {display.map((ls) => (
            <tr key={ls._id}>
              <td>{ls.name}</td>
              <td>{ls.des}</td>
              <td>Rs.{ls.price}</td>
              <td>
                <img className="product-img" src={`http://localhost:9000/${ls.filepath}`} alt="Product" style={{ width: "80px", height: "60px" }} />
              </td>
              <td>
                <button className="product-button edit" style={{ backgroundColor: "green", color: "white" }} onClick={() => handleEditClick(ls)}>Edit</button>
                <button 
  className="product-button delete" 
  style={{ backgroundColor: "red", color: "white" }} 
  onClick={() => handleDeleteClick(ls._id)}
>
  Delete
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <EditForm 
          selectedProduct={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onProductUpdated={fetchProducts} 
        />
      )}
    </div>
  );
}

export default Edit;
