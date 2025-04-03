import React, { useState } from "react";
import AXIOS from "axios";
import "../../css/edit_form.css";

function EditForm({ selectedProduct, onClose, onProductUpdated }) {
  const [name, setName] = useState(selectedProduct.name);
  const [des, setDes] = useState(selectedProduct.des);
  const [price, setPrice] = useState(selectedProduct.price);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("des", des);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }

    try {
      await AXIOS.put(
        `http://localhost:9000/up/productupdate/${selectedProduct._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Product updated successfully");
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="edit-form-container"> {/* Updated class name */}
        <div className="edit-form"> {/* Updated class name */}
          <h2>Edit Product</h2>
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

            <label>Description:</label>
            <input type="text" value={des} onChange={(e) => setDes(e.target.value)} required />

            <label>Price:</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

            <label>Product Image:</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />

            <div className="button-group">
              <button type="submit" className="update-btn">Update</button>
              <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditForm;
