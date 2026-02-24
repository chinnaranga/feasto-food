import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Skeleton from "./Skeleton";

/**
 * RequireAuth - Protects routes that need authentication
 * Supports both wrapping children and nested routing via Outlet
 */
export default function RequireAuth({ children }) {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="p-4 w-full h-screen flex justify-center items-start pt-20">
                <Skeleton />
            </div>
        );
    }

    if (!currentUser) {
        // Redirect to login, but save where user wanted to go
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children ? children : <Outlet />;
}
