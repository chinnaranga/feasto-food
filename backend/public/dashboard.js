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
        const latency = Math.round(performance.now() - start);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // 1. Timestamp
        ELEMENTS.timestamp.innerText = new Date(data.timestamp).toLocaleString('en-US', {
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,
            month: 'short', day: 'numeric', timeZoneName: 'short'
        });

        // 2. Uptime
        ELEMENTS.uptime.innerText = formatUptime(data.uptime);

        // 3. Memory (Heap & RSS)
        if (data.memory) {
            // Heap
            const heapUsed = data.memory.heapUsed || 0;
            const heapTotal = data.memory.heapTotal || 0; // If backend provides this
            const rss = data.memory.rss || 0;

            ELEMENTS.heapVal.innerText = formatBytes(heapUsed);
            ELEMENTS.rssVal.innerText = formatBytes(rss);

            // Bar - Assume 512MB limit if no total provided, or use total
            const limit = 536870912; // 512MB
            const percent = Math.min((heapUsed / limit) * 100, 100);

            ELEMENTS.heapBar.style.width = `${percent}%`;
            ELEMENTS.heapTotal.innerText = `of ${formatBytes(limit)} (Allocated)`;

            // Color logic
            if (percent > 85) ELEMENTS.heapBar.className = "h-full bg-red-500 rounded-full transition-all duration-1000 ease-out";
            else if (percent > 60) ELEMENTS.heapBar.className = "h-full bg-yellow-500 rounded-full transition-all duration-1000 ease-out";
            else ELEMENTS.heapBar.className = "h-full bg-brand-500 rounded-full transition-all duration-1000 ease-out";
        }

        // 4. DB Status
        if (data.dbConnection) {
            ELEMENTS.dbStatus.innerText = "Connected";
            ELEMENTS.dbStatus.className = "text-xl font-bold text-white tracking-tight";
            ELEMENTS.dbIndicator.className = "w-3 h-3 rounded-full bg-emerald-500 animate-pulse";
        } else {
            // Fallback if data.dbConnection is missing/false but request succeeded
            // logic depends on backend response shape
        }

        // 5. Global Status Update
        ELEMENTS.globalStatus.innerText = "OPERATIONAL";
        ELEMENTS.globalStatus.className = "text-xs font-medium text-emerald-500 tracking-wide";

    } catch (e) {
        console.error(e);
        // Error State
        ELEMENTS.globalStatus.innerText = "OFFLINE";
        ELEMENTS.globalStatus.className = "text-xs font-medium text-red-500 tracking-wide";

        ELEMENTS.dbStatus.innerText = "Disconnected";
        ELEMENTS.dbIndicator.className = "w-3 h-3 rounded-full bg-red-500";
    }
}

// Init
fetchHealth();
setInterval(fetchHealth, 5000);
