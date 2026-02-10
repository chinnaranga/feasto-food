const ELEMENTS = {
    serverTime: document.getElementById('server-time'),
    uptime: document.getElementById('uptime'),
    statusText: document.getElementById('api-status-text'),
    statusIndicator: document.getElementById('api-status-indicator'),
    statusCard: document.getElementById('status-card'),
    memoryValue: document.getElementById('memory-value'),
    memoryBar: document.getElementById('memory-bar')
};

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function setStatus(state, latency) {
    // States: 'online', 'degraded', 'offline'

    if (state === 'online') {
        ELEMENTS.statusText.innerText = `Online (${latency}ms)`;
        ELEMENTS.statusText.className = "text-2xl font-semibold tracking-tight text-emerald-400 transition-colors duration-300";
        ELEMENTS.statusIndicator.innerHTML = `
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        `;
        ELEMENTS.statusCard.className = "bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left shadow-lg hover:border-slate-700 transition duration-300 group";

    } else if (state === 'degraded') {
        ELEMENTS.statusText.innerText = `High Load (${latency}ms)`;
        ELEMENTS.statusText.className = "text-2xl font-semibold tracking-tight text-yellow-500 transition-colors duration-300";
        ELEMENTS.statusIndicator.innerHTML = `
            <span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-500 animate-pulse"></span>
        `;
        ELEMENTS.statusCard.className = "bg-yellow-900/10 border border-yellow-500/20 rounded-2xl p-6 text-left shadow-lg transition duration-300 group";

    } else {
        ELEMENTS.statusText.innerText = "Offline";
        ELEMENTS.statusText.className = "text-2xl font-semibold tracking-tight text-red-500 transition-colors duration-300";
        ELEMENTS.statusIndicator.innerHTML = `
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        `;
        ELEMENTS.statusCard.className = "bg-red-900/10 border border-red-500/20 rounded-2xl p-6 text-left shadow-lg transition duration-300 group";
    }
}

async function fetchHealth() {
    const start = performance.now();
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const res = await fetch('/api/health', { signal: controller.signal });
        clearTimeout(timeoutId);

        const latency = Math.round(performance.now() - start);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // Time & Uptime
        ELEMENTS.serverTime.innerText = new Date(data.timestamp).toLocaleTimeString();

        const uptime = Math.floor(data.uptime);
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        ELEMENTS.uptime.innerText = `${h}h ${m}m ${s}s`;

        // Memory Logic
        if (data.memory && data.memory.heapUsed) {
            const used = data.memory.heapUsed;
            const total = data.memory.heapTotal; // or rss
            const usagePercent = Math.min((used / 536870912) * 100, 100); // Assume 512MB budget for visual scaling

            ELEMENTS.memoryValue.innerText = formatBytes(used);
            ELEMENTS.memoryBar.style.width = `${usagePercent}%`;

            // Colorize Bar
            if (usagePercent > 80) ELEMENTS.memoryBar.className = "h-full bg-red-500 rounded-full transition-all duration-500";
            else if (usagePercent > 50) ELEMENTS.memoryBar.className = "h-full bg-yellow-500 rounded-full transition-all duration-500";
            else ELEMENTS.memoryBar.className = "h-full bg-emerald-500 rounded-full transition-all duration-500";

            // Determine Status
            if (latency > 800 || usagePercent > 90) setStatus('degraded', latency);
            else setStatus('online', latency);
        } else {
            setStatus('online', latency);
        }

    } catch (e) {
        console.warn("Health check failed:", e);
        setStatus('offline', 0);
        ELEMENTS.serverTime.style.opacity = "0.5";
        ELEMENTS.uptime.style.opacity = "0.5";
    } finally {
        if (ELEMENTS.serverTime.style.opacity === "0.5") ELEMENTS.serverTime.style.opacity = "1";
        if (ELEMENTS.uptime.style.opacity === "0.5") ELEMENTS.uptime.style.opacity = "1";
    }
}

// Initial fetch
fetchHealth();

// Poll every 3 seconds
setInterval(fetchHealth, 3000);
