import { Shield } from "lucide-react";
import { useMaintenance } from "../hooks/useMaintenance";

export default function AdminMaintenanceBanner() {
    const { active, isAdmin } = useMaintenance();

    if (!active || !isAdmin) return null;

    return (
        <div className="fixed top-0 inset-x-0 bg-red-600 text-white text-sm px-4 py-2 flex items-center justify-center gap-2 z-[100] font-bold shadow-lg animate-pulse">
            <Shield size={16} />
            MAINTENANCE ACTIVE: You are accessing as an Admin. Regular users are blocked.
        </div>
    );
}
