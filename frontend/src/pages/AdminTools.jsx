import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { Card, CardHeader, CardBody, Button, Badge } from "../components/ui";
import { ShieldAlert, Server, Activity, Database, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTools() {
    const [maintenance, setMaintenance] = useState(false);
    const [loading, setLoading] = useState(false);
    const [systemHealth, setSystemHealth] = useState({
        database: "online",
        server: "online",
        storage: "online"
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch current maintenance status
        const fetchStatus = async () => {
            try {
                const docSnap = await getDoc(doc(db, "app_config", "global"));
                if (docSnap.exists()) {
                    setMaintenance(docSnap.data().maintenance);
                }
            } catch (e) {
                console.error("Failed to fetch config", e);
                setError(e.message);
            }
        };
        fetchStatus();
    }, []);

    const toggleMaintenance = async (enable) => {
        setLoading(true);
        try {
            await setDoc(doc(db, "app_config", "global"), {
                maintenance: enable,
                message: enable ? "Maintenance Mode Enabled via Admin Tools" : "",
                lastUpdated: serverTimestamp(),
                schedule: { enabled: false, start: null, end: null }
            }, { merge: true });

            setMaintenance(enable);
            if (enable) toast.success("Maintenance Mode ENABLED 🔴");
            else toast.success("Maintenance Mode DISABLED 🟢");

        } catch (e) {
            console.error(e);
            toast.error("Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const checkHealth = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`);
            if (response.ok) {
                const data = await response.json();
                setSystemHealth(prev => ({
                    ...prev,
                    server: "online",
                    database: data.dbConnection ? "online" : "offline",
                    storage: "online" // storage check not implemented yet
                }));
                toast.success("System health refreshed: Online 🟢");
            } else {
                throw new Error("Health check failed");
            }
        } catch (error) {
            console.error(error);
            setSystemHealth(prev => ({
                ...prev,
                server: "offline",
                database: "unknown"
            }));
            toast.error("System health check failed 🔴");
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Error Loading Admin Tools</h2>
                    <p>{error}</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Tools</h1>
                    <p className="text-gray-400">System configuration and health monitoring.</p>
                </div>
                <Button variant="outline" icon={RefreshCw} onClick={checkHealth}>
                    Refresh Status
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Maintenance Control */}
                <Card variant="glass" className="border-red-500/20">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Emergency Control</h2>
                                <p className="text-sm text-gray-400">Manage global maintenance mode</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-4">
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-gray-300 font-medium">Current Status</span>
                            {maintenance ? (
                                <Badge variant="danger" className="flex items-center gap-1">
                                    <XCircle size={12} /> MAINTENANCE ON
                                </Badge>
                            ) : (
                                <Badge variant="success" className="flex items-center gap-1">
                                    <CheckCircle size={12} /> SYSTEMS LIVE
                                </Badge>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant={maintenance ? "secondary" : "danger"}
                                onClick={() => toggleMaintenance(true)}
                                disabled={maintenance || loading}
                                className="w-full"
                            >
                                Enable Maintenance
                            </Button>
                            <Button
                                variant={!maintenance ? "secondary" : "success"}
                                onClick={() => toggleMaintenance(false)}
                                disabled={!maintenance || loading}
                                className="w-full"
                            >
                                Disable Maintenance
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Enabling maintenance will lock out all non-admin users immediately.
                        </p>
                    </CardBody>
                </Card>

                {/* System Health */}
                <Card variant="elevated">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">System Health</h2>
                                <p className="text-sm text-gray-400">Real-time infrastructure status</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Database size={18} className="text-gray-400" />
                                    <span className="text-gray-300">Primary Database (Firestore)</span>
                                </div>
                                <StatusBadge status={systemHealth.database} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Server size={18} className="text-gray-400" />
                                    <span className="text-gray-300">API Gateway</span>
                                </div>
                                <StatusBadge status={systemHealth.server} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <RefreshCw size={18} className="text-gray-400" />
                                    <span className="text-gray-300">Storage Service</span>
                                </div>
                                <StatusBadge status={systemHealth.storage} />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

const StatusBadge = ({ status }) => {
    const colors = {
        online: "success",
        degraded: "warning",
        offline: "danger"
    };
    return (
        <Badge variant={colors[status] || "default"} className="uppercase text-xs" color={colors[status] || "gray"}>
            {status}
        </Badge>
    );
};
