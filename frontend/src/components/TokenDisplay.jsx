// src/components/TokenDisplay.js
import React, { useState, useEffect } from "react";

function TokenDisplay() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // Listen for storage changes (e.g., if token is updated in another tab)
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!token) return null;

  // Show only part of token for safety
  const preview =
    token.length > 20
      ? `${token.slice(0, 10)}...${token.slice(-10)}`
      : token;

  return (
    <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Stored Token
      </h3>
      <code className="break-all text-sm text-gray-700">{preview}</code>
    </div>
  );
}

export default TokenDisplay;