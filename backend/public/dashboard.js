// Simple script to fetch health and update UI
async function fetchHealth() {
    try {
        // Fetch from /api/health relative to current origin
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // Update Server Time
        const timeEl = document.getElementById('server-time');
        if (timeEl) {
            timeEl.innerText = new Date(data.timestamp).toLocaleTimeString();
        }

        // Update Uptime
        const uptimeEl = document.getElementById('uptime');
        if (uptimeEl) {
            const uptime = Math.floor(data.uptime);
            const h = Math.floor(uptime / 3600);
            const m = Math.floor((uptime % 3600) / 60);
            const s = Math.floor(uptime % 60);
            uptimeEl.innerText = `${h}h ${m}m ${s}s`;
        }

    } catch (e) {
        console.error("Health check failed", e);
        // Optional: Show error state in UI
    }
}

// Initial fetch
fetchHealth();

// Poll every 5 seconds
setInterval(fetchHealth, 5000);
