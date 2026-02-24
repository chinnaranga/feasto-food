import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "../components/PageLoader";

export default function RestaurantGuard({ children }) {
    const { currentUser, userData, loading } = useAuth();

    if (loading) {
        return <PageLoader />;
    }

    // Check if logged in AND has restaurant_admin role
    // Note: users collection role is source of truth
    const isRestaurantAdmin = currentUser && userData?.role === "restaurant_admin" || userData?.role === "super_admin";

    if (!isRestaurantAdmin) {
        return <Navigate to="/restaurant/login" replace />;
    }

    return children ? children : <Outlet />;
}
