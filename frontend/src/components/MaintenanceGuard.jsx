import React, { Suspense, lazy } from "react";
import { useAuth } from "../context/AuthContext";
import { useMaintenance } from "../hooks/useMaintenance";
import { Loader2 } from "lucide-react";

import { useLocation } from "react-router-dom";

const MaintenancePage = lazy(() => import("../pages/MaintenancePage"));

export default function MaintenanceGuard({ children }) {
    const { currentUser, loading: authLoading } = useAuth();
    const { isMaintenanceActive, admins, loading: maintenanceLoading } = useMaintenance();
    const location = useLocation();

    // 🚨 EMERGENCY BYPASS: Add ?emergency_access=true to URL to bypass check
    if (location.search.includes("emergency_access=true")) {
        return children;
    }



    if (authLoading || maintenanceLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    const isAdmin = currentUser?.email && admins.includes(currentUser.email);

    // 🚨 Block non-admin users if maintenance is active
    if (isMaintenanceActive && !isAdmin) {
        return (
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-black"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>}>
                <MaintenancePage />
            </Suspense>
        );
    }

    // Allow normal access
    return children;
}
