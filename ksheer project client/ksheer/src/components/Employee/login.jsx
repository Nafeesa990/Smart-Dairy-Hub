import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/delivery.css";

function Delivery() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9000/delivery/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("deliveryToken", data.token);
        // alert("Login successful!");
        navigate("/Orders");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error logging in. Try again later.");
    }
  };

  return (
    <div className="delivery-login-container">
      <form className="delivery-login-form" onSubmit={handleLogin}>
        <h2 className="delivery-login-title">Delivery Agent Login</h2>

        <input
          type="text"
          placeholder="Agent ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="delivery-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="delivery-input"
          required
        />

        <button type="submit" className="delivery-login-button">
          Login
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default Delivery;
