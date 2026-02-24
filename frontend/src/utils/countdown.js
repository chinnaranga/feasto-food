export function getCountdown(target) {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return null;

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hrs}h ${mins}m`;
}
