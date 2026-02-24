import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function RequireAdmin({ children }) {
    const { currentUser } = useAuth();

    // Assuming currentUser has a role property. 
    // If your auth provider doesn't set this yet, we might need to fetch it or mock it.
    // For now, we'll check if currentUser exists and if they are an admin.
    // NOTE: In a real app, you'd verify this claim securely or fetch the profile.
    const isAdmin = currentUser && (currentUser.role === "admin" || currentUser.email?.includes("admin")); // Simple check for demo

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        toast.error("Access denied: Admin only area 🔒");
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
