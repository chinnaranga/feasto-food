// src/Auth.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import toast from "react-hot-toast";
import "./Auth.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter both email and password.");
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Email Login Error:", error.code, error.message);
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error.code, error.message);
      toast.error(`Google Sign-In Failed: ${error.code}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo-container">
          <img src="/logo.png" alt="Logo" className="auth-logo" />
        </div>

        <h2 className="app-title">Welcome Back</h2>
        <p>Login to continue your journey</p>

        {/* Email/Password Login */}
        <form onSubmit={handleEmailLogin} className="form">
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="password-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        {/* Social Login */}
        <div className="social-login">
          <p>or continue with</p>
          <button onClick={handleGoogleSignIn} className="google-btn">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}