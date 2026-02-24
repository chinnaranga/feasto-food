import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function RequireRiderAuth() {
    const { currentUser, userData, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-[#FF7A00]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/rider/login" replace state={{ from: location }} />;
    }

    // Optional: Check if role is 'rider' if strict RBAC is needed. 
    // For now, assuming any auth user can "try" to be a rider, 
    // or better, check if they have a rider profile (implied by userData role).
    // prompt says: "If authenticated -> allow access". 
    // I will stick to basic auth check + maybe a role check if userData allows.
    // If I enforce role='rider' and they are 'customer', they might get stuck.
    // For safety in this "Fix" phase, basic auth is better than open, role check is best.
    // I'll add a check if userData exists.

    // if (userData && userData.role !== 'rider') { ... } 
    // But let's trust "If authenticated -> allow access" from prompt Step 1.

    return <Outlet />;
}
