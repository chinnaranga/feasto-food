const ELEMENTS = {
    timestamp: document.getElementById('server-timestamp'),
    uptime: document.getElementById('uptime-val'),
    heapVal: document.getElementById('heap-val'),
    heapUsed: document.getElementById('heap-used'),
    heapBar: document.getElementById('heap-bar'),
    rssVal: document.getElementById('rss-val'),
    dbStatus: document.getElementById('db-status'),
    dbIndicator: document.getElementById('db-indicator'),
    dbContainer: document.getElementById('db-indicator-container'),
    globalStatus: document.getElementById('global-status'),
    footerStatus: document.getElementById('footer-status')
};

// Utils
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
};


// Logic
async function fetchHealth() {
    try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // 1. Timestamp
        if (ELEMENTS.timestamp) {
            ELEMENTS.timestamp.innerText = new Date(data.timestamp).toLocaleString('en-US', {
                hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,
                month: 'short', day: 'numeric', timeZoneName: 'short'
            });
        }

        // 2. Uptime
        if (ELEMENTS.uptime) ELEMENTS.uptime.innerText = formatUptime(data.uptime);

        // 3. Memory
        if (data.memory && ELEMENTS.heapVal) {
            const heapUsed = data.memory.heapUsed || 0;
            const rss = data.memory.rss || 0;

            ELEMENTS.heapVal.innerText = formatBytes(heapUsed);
            if (ELEMENTS.heapUsed) ELEMENTS.heapUsed.innerText = formatBytes(heapUsed);
            if (ELEMENTS.rssVal) ELEMENTS.rssVal.innerText = formatBytes(rss);

            // Bar
            const limit = 536870912; // 512MB
            const percent = Math.min((heapUsed / limit) * 100, 100);
            if (ELEMENTS.heapBar) ELEMENTS.heapBar.style.width = `${percent}%`;
        }

        // 4. DB Status
        if (data.dbConnection && ELEMENTS.dbStatus) {
            ELEMENTS.dbStatus.innerText = "Connected";
            // Remove offline styling if present
            if (ELEMENTS.dbContainer) ELEMENTS.dbContainer.classList.remove('status-offline');
        } else {
            if (ELEMENTS.dbStatus) ELEMENTS.dbStatus.innerText = "Disconnected";
            if (ELEMENTS.dbContainer) ELEMENTS.dbContainer.classList.add('status-offline');
        }

        // 5. Global Status
        if (ELEMENTS.globalStatus) {
            ELEMENTS.globalStatus.innerText = "● OPERATIONAL";
            // Ensure badge color is green (handled by CSS, but in case we want to toggle error state)
            ELEMENTS.globalStatus.style.color = "#4ade80";
        }

    } catch (e) {
        console.error(e);
        if (ELEMENTS.globalStatus) {
            ELEMENTS.globalStatus.innerText = "● OFFLINE";
            ELEMENTS.globalStatus.style.color = "#ef4444";
        }
        if (ELEMENTS.dbContainer) ELEMENTS.dbContainer.classList.add('status-offline');
        if (ELEMENTS.dbStatus) ELEMENTS.dbStatus.innerText = "Connection Failed";
    }
}

// Analytics Polling
async function fetchAnalytics() {
    try {
        const res = await fetch('/api/admin/stats');
        // If 401 unauthorized (no cookie/token), just silently fail or show dashes
        if (res.status === 401) return;
        const data = await res.json();

        if (data) {
            // Error Rate
            if (document.getElementById("error-rate-val")) {
                document.getElementById("error-rate-val").innerText = (data.errorRate || 0) + "%";
                const card = document.getElementById("error-card");
                if (parseFloat(data.errorRate) > 5) {
                    if (card) card.style.borderColor = "#ef4444";
                } else {
                    if (card) card.style.borderColor = "";
                }
            }
            // Orders Today
            if (document.getElementById("orders-today-val")) {
                document.getElementById("orders-today-val").innerText = data.ordersToday || 0;
            }
        }
    } catch (e) {
        console.error("Analytics Error", e);
    }
}

// Init
fetchAnalytics();
fetchHealth();
setInterval(fetchHealth, 5000);
setInterval(fetchAnalytics, 15000);
