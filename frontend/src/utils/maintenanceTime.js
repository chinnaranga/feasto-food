export function getISTNow() {
    return new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
}

export function isMaintenanceTime() {
    if (import.meta.env.VITE_FORCE_MAINTENANCE === "true") {
        return true;
    }

    const istNow = getISTNow();
    const hour = istNow.getHours();
    const minutes = istNow.getMinutes();

    // Maintenance from 22:30 (10:30 PM) to 10:00 (10 AM) IST
    // DISABLED: Hardcoded schedule removed. Relying on Firestore config if needed, or manual override.
    // return (hour === 22 && minutes >= 30) || hour >= 23 || hour < 10;
    return false;
}

export function getRemainingTime() {
    const istNow = getISTNow();

    // Target: 10:00 AM IST
    const endTime = new Date(istNow);
    endTime.setHours(10, 0, 0, 0);

    // If it's already past 10 AM today, scheduling for tomorrow 10 AM
    // This handles the case where we are in the 10:30 PM part of the window
    if (endTime <= istNow) {
        endTime.setDate(endTime.getDate() + 1);
    }

    const diff = endTime - istNow;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { hours, minutes, seconds };
}


