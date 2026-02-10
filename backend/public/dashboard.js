const ELEMENTS = {
    serverTime: document.getElementById('server-time'),
    uptime: document.getElementById('uptime'),
    statusText: document.getElementById('api-status-text'),
    statusIndicator: document.getElementById('api-status-indicator'),
    statusCard: document.getElementById('status-card')
};

function setStatus(isOnline) {
    if (isOnline) {
        // Text
        ELEMENTS.statusText.innerText = "Online";
        ELEMENTS.statusText.className = "text-2xl font-semibold tracking-tight text-emerald-400 transition-colors duration-300";

        // Indicator (Green Pulse)
        ELEMENTS.statusIndicator.innerHTML = `
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        `;

        // Card Border (optional refined touch)
        ELEMENTS.statusCard.classList.remove('border-red-900/50', 'bg-red-950/10');
        ELEMENTS.statusCard.classList.add('border-slate-800', 'bg-slate-900');

    } else {
        // Text
        ELEMENTS.statusText.innerText = "Offline";
        ELEMENTS.statusText.className = "text-2xl font-semibold tracking-tight text-red-500 transition-colors duration-300";

        // Indicator (Red Static)
        ELEMENTS.statusIndicator.innerHTML = `
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        `;

        // Card Visuals
        ELEMENTS.statusCard.classList.remove('border-slate-800', 'bg-slate-900');
        ELEMENTS.statusCard.classList.add('border-red-900/50', 'bg-red-950/10');
    }
}

async function fetchHealth() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

        const res = await fetch('/api/health', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // Update Time & Uptime
        ELEMENTS.serverTime.innerText = new Date(data.timestamp).toLocaleTimeString();

        const uptime = Math.floor(data.uptime);
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        ELEMENTS.uptime.innerText = `${h}h ${m}m ${s}s`;

        setStatus(true);

    } catch (e) {
        console.warn("Health check failed:", e);
        setStatus(false);
        // Keep old values but maybe dim them?
        ELEMENTS.serverTime.style.opacity = "0.5";
        ELEMENTS.uptime.style.opacity = "0.5";
    } finally {
        ELEMENTS.serverTime.style.opacity = "1";
        ELEMENTS.uptime.style.opacity = "1";
    }
}

// Initial fetch
fetchHealth();

// Poll every 3 seconds
setInterval(fetchHealth, 3000);
