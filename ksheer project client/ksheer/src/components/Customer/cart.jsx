import React, { useState, useEffect } from "react";
import AXIOS from "axios";
import "../../css/cart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Dash from './dashcustomer';
import { useNavigate } from "react-router-dom";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            AXIOS.get(`http://localhost:9000/cart/${userId}`)
                .then((res) => setCartItems(res.data))
                .catch((err) => console.error("Error fetching cart items:", err));
        }
    }, [userId]);

    console.log("Cart before saving:", cartItems);
localStorage.setItem("cart", JSON.stringify(cartItems));
console.log("Cart saved in localStorage:", localStorage.getItem("cart"));


    // Function to handle quantity change
    const handleQuantityChange = (productId,
         newQuantity) => {
        const updatedCart = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
    };

    // Function to remove an item from the cart
    const handleRemoveFromCart = (productId) => {
        AXIOS.delete(`http://localhost:9000/cart/remove/${userId}/${productId}`)
            .then(() => {
                setCartItems(cartItems.filter(item => item.productId !== productId));
            })
            .catch(err => console.error("Error removing item:", err));
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Navigate to Shipping Page with total price
    const handleProceedToCheckout = () => {
        localStorage.setItem("progress", "shipping");
        console.log(cartItems)
        navigate("/Shipping", { state: {cartItems, totalAmount: totalPrice, userId } });
    };

    return (
        <div>
          <Dash/>
          <div className="cart-container">
              <h2>Your Cart</h2>
              {cartItems.length > 0 ? (
                  <>
                      {cartItems.map((item) => (
                          <div key={item.productId} className="cart-item">
                              {/* Left Side: Image, Name, Price */}
                              <div className="cart-left">
                                  <img src={`http://localhost:9000/${item.image}`} alt={item.name} className="cart-image" />
                                  <div className="cart-details">
                                      <h3>{item.name}</h3>
                                      <p>Price: Rs.{item.price}</p>
                                  </div>
                              </div>

                              {/* Right Side: Quantity, Remove Button */}
                              <div className="cart-right">
                                  <select
                                      className="quantity-dropdown"
                                      value={item.quantity}
                                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                                  >
                                      {[...Array(10).keys()].map(num => (
                                          <option key={num + 1} value={num + 1}>{num + 1}</option>
                                      ))}
                                  </select>

                                  <button className="remove-button" onClick={() => handleRemoveFromCart(item.productId)}>
                                      <FontAwesomeIcon icon={faTrash} style={{ color: "red" }} />
                                  </button>
                              </div>
                          </div>
                      ))}

                      {/* Centered Total Price and Checkout Button */}
                      <div className="checkout-container">
                          <h3 className="total-price">Total Price: Rs.{totalPrice}</h3>
                          <button className="checkout-button" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
                      </div>
                  </>
              ) : (
                  <p>Your cart is empty.</p>
              )}
          </div>
        </div>
    );
}

export default Cart;
