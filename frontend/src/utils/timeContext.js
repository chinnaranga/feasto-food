export function getTimeContext() {
    const hour = new Date().getHours();

    if (hour < 11) return "morning";
    if (hour < 17) return "afternoon";
    if (hour < 22) return "evening";
    return "night";
}
