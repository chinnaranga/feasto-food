export function getTimeSlot() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 16) return "lunch";
    if (hour >= 16 && hour < 22) return "dinner";
    return "late_night";
}
