import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import App from "./App.jsx";
import { AeroBiteAIProvider } from "./context/AeroBiteAIContext";
import initConsoleFilter from "./utils/consoleFilter";
import { Toaster } from "react-hot-toast";

import { HelmetProvider } from "react-helmet-async";

// Initialize console filter (dev only)
initConsoleFilter();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AeroBiteAIProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#18181b",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          />
        </AeroBiteAIProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
