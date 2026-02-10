const ELEMENTS = {
    timestamp: document.getElementById('server-timestamp'),
    uptime: document.getElementById('uptime-val'),
    heapVal: document.getElementById('heap-val'),
    heapTotal: document.getElementById('heap-total'),
    heapBar: document.getElementById('heap-bar'),
    rssVal: document.getElementById('rss-val'),
    dbStatus: document.getElementById('db-status'),
    dbIndicator: document.getElementById('db-indicator'),
    globalStatus: document.getElementById('global-status')
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
    const s = Math.floor(seconds % 60); // Optional seconds
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
};


// Logic
async function fetchHealth() {
    try {
        // Fetch
        const start = performance.now();
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
            if (ELEMENTS.rssVal) ELEMENTS.rssVal.innerText = formatBytes(rss);

            // Bar
            const limit = 536870912; // 512MB
            const percent = Math.min((heapUsed / limit) * 100, 100);
            if (ELEMENTS.heapBar) ELEMENTS.heapBar.style.width = `${percent}%`;
        }

        // 4. DB Status
        if (data.dbConnection && ELEMENTS.dbStatus) {
            ELEMENTS.dbStatus.innerText = "Connected";
            ELEMENTS.dbIndicator.className = "w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981] animate-pulse";
        }

        // 5. Global Status
        if (ELEMENTS.globalStatus) {
            ELEMENTS.globalStatus.innerText = "OPERATIONAL";
            ELEMENTS.globalStatus.className = "text-xs font-medium text-emerald-500 tracking-wide";
        }

    } catch (e) {
        console.error(e);
        if (ELEMENTS.globalStatus) {
            ELEMENTS.globalStatus.innerText = "OFFLINE";
            ELEMENTS.globalStatus.className = "text-xs font-medium text-red-500 tracking-wide";
        }
        if (ELEMENTS.dbStatus) {
            ELEMENTS.dbStatus.innerText = "Disconnected";
            ELEMENTS.dbIndicator.className = "w-3 h-3 rounded-full bg-red-500";
        }
    }
}

// Analytics Polling
async function fetchAnalytics() {
    try {
        const res = await fetch('/api/admin/stats');
        if (res.status === 401) return;
        const data = await res.json();

        if (data) {
            if (document.getElementById("rpm-val")) document.getElementById("rpm-val").innerText = data.rpm || 0;
            if (document.getElementById("error-rate-val")) {
                document.getElementById("error-rate-val").innerText = (data.errorRate || 0) + "%";
                // Glass-specific error styling
                const card = document.getElementById("error-card");
                if (parseFloat(data.errorRate) > 5) {
                    if (card) card.style.borderColor = "rgba(244, 63, 94, 0.5)"; // Red border
                } else {
                    if (card) card.style.borderColor = "";
                }
            }
            if (document.getElementById("orders-today-val")) document.getElementById("orders-today-val").innerText = data.ordersToday || 0;
        }
    } catch (e) {
        console.error("Analytics Error", e);
    }
}

// Animation Utils (Placeholder for future)
// function animateValue(obj, start, end, duration) { ... }

// Init
fetchAnalytics();
fetchHealth();
setInterval(fetchHealth, 5000);
setInterval(fetchAnalytics, 15000);
