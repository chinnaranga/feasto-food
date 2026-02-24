import React, { useState } from "react";
import "./AuthCard.css";

function AuthCard() {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "signup" && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`${activeTab.toUpperCase()} Successful!`);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="app-title">🍔 Food Ordering App</h1>

        <div className="tabs">
          <button
            className={activeTab === "login" ? "tab active" : "tab"}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "signup" ? "tab active" : "tab"}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {activeTab === "signup" && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {activeTab === "signup" && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" className="submit-btn">
            {activeTab === "login" ? "Login" : "Signup"}
          </button>
        </form>

        {activeTab === "login" && (
          <p className="forgot-password">Forgot Password?</p>
        )}

        <div className="social-login">
          <button className="google-btn">Continue with Google</button>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
