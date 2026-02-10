import { useState, useEffect, useMemo } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export function useMaintenance() {
    const [config, setConfig] = useState({
        maintenance: false,
        message: "We'll be back shortly.",
        admins: [],
        schedule: { enabled: false, start: null, end: null },
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(
            doc(db, "app_config", "global"),
            (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    setConfig({
                        maintenance: !!data.maintenance,
                        message: data.message || "We'll be back shortly.",
                        admins: data.admins || [],
                        schedule: data.schedule || { enabled: false, start: null, end: null },
                    });
                }
                setLoading(false);
            },
            (err) => {
                console.error("Maintenance config error:", err);
                setLoading(false);
            }
        );

        return () => unsub();
    }, []);

    const { isMaintenanceActive, endTime } = useMemo(() => {
        // 🚨 Development Override
        /*
        if (import.meta.env.VITE_FORCE_MAINTENANCE === 'true') {
            const now = new Date();
            const target = new Date();
            target.setHours(10, 0, 0, 0); // Set to 10:00 AM

            // If currently past 10 AM, set for tomorrow
            if (now > target) {
                target.setDate(target.getDate() + 1);
            }

            return { isMaintenanceActive: true, endTime: target };
        }
        */

        // 🚨 FORCED MAINTENANCE MODE (User Request)
        return { isMaintenanceActive: true, endTime: null };

        // 1. Manual Override from Firestore (Global Kill Switch)
        if (config.maintenance) {
            return { isMaintenanceActive: true, endTime: null };
        }

        // 2. Nightly Schedule (Only if enabled in Firestore)
        if (config.schedule?.enabled) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const MINUTES_SINCE_MIDNIGHT = currentHour * 60 + currentMinute;

            const START_TIME = 22 * 60 + 30; // 22:30 -> 1350 mins
            const END_TIME = 10 * 60;        // 10:00 -> 600 mins

            // Active if: Time is AFTER 10:30 PM OR BEFORE 10:00 AM
            const isNightlyactive = MINUTES_SINCE_MIDNIGHT >= START_TIME || MINUTES_SINCE_MIDNIGHT < END_TIME;

            if (isNightlyactive) {
                console.log("🌙 Nightly Maintenance Active");
                // Calculate next 10:00 AM
                const nextEnd = new Date(now);
                if (currentHour >= 22) {
                    // It's night (e.g. 11 PM), end is tomorrow 10 AM
                    nextEnd.setDate(nextEnd.getDate() + 1);
                } else {
                    // It's morning (e.g. 2 AM), end is today 10 AM
                }
                nextEnd.setHours(10, 0, 0, 0);

                return { isMaintenanceActive: true, endTime: nextEnd };
            }
        }

        return { isMaintenanceActive: false, endTime: null };
    }, [config]);

    return {
        isMaintenanceActive,
        message: config.message,
        admins: config.admins,
        endTime,
        loading,
    };
}
