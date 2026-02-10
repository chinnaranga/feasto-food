/* ═══════════════════════════════════════════════════
   AeroBite — Enhanced Futuristic Dashboard JS
   ═══════════════════════════════════════════════════ */

// ─── DOM ELEMENTS ────────────────────────────
const ELEMENTS = {
    timestamp: document.getElementById('server-timestamp'),
    uptime: document.getElementById('uptime-val'),
    heapVal: document.getElementById('heap-val'),
    heapUsed: document.getElementById('heap-used'),
    heapBar: document.getElementById('heap-bar'),
    rssVal: document.getElementById('rss-val'),
    rssBar: document.getElementById('rss-bar'),
    dbStatus: document.getElementById('db-status'),
    dbIndicator: document.getElementById('db-indicator'),
    dbContainer: document.getElementById('db-indicator-container'),
    globalStatus: document.getElementById('global-status'),
    footerStatus: document.getElementById('footer-status'),
    subtitleText: document.getElementById('subtitle-text'),
    particlesCanvas: document.getElementById('particles-canvas'),
    dataRain: document.getElementById('data-rain'),
};

// ─── UTILITY FUNCTIONS ───────────────────────
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatUptime = (seconds) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${Math.floor(seconds % 60)}s`;
};

// ─── ANIMATED NUMBER COUNTER ─────────────────
function animateValue(el, newValue, suffix = '') {
    if (!el) return;
    const current = parseFloat(el.textContent) || 0;
    const target = parseFloat(newValue) || 0;
    if (current === target) { el.textContent = newValue + suffix; return; }

    const duration = 800;
    const startTime = performance.now();
    const isFloat = String(newValue).includes('.');

    const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const val = current + (target - current) * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// ─── GLITCH EFFECT ───────────────────────────
function triggerGlitch() {
    const metrics = document.querySelectorAll('.metric-value');
    if (metrics.length === 0) return;
    const idx = Math.floor(Math.random() * metrics.length);
    metrics[idx].classList.add('glitch');
    setTimeout(() => metrics[idx].classList.remove('glitch'), 300);
}
// Random glitch every 5-12 seconds
function scheduleGlitch() {
    const delay = 5000 + Math.random() * 7000;
    setTimeout(() => { triggerGlitch(); scheduleGlitch(); }, delay);
}
scheduleGlitch();

// ─── TERMINAL TYPING ANIMATION ──────────────
function typeWriter(el, text, speed = 40) {
    if (!el) return;
    el.innerHTML = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '▋';
    el.appendChild(cursor);

    function tick() {
        if (i < text.length) {
            el.insertBefore(document.createTextNode(text[i]), cursor);
            i++;
            setTimeout(tick, speed + Math.random() * 30);
        }
    }
    tick();
}
typeWriter(ELEMENTS.subtitleText, 'Live operational metrics from the production backend cluster.');

// ─── 3D CARD TILT ────────────────────────────
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${y * -12}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)';
    });
});

// ─── RIPPLE EFFECT ON BUTTONS ────────────────
document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const circle = document.createElement('span');
        circle.className = 'ripple';
        const diameter = Math.max(this.clientWidth, this.clientHeight);
        circle.style.width = circle.style.height = `${diameter}px`;
        const rect = this.getBoundingClientRect();
        circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
        circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
        this.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    });
});

// ─── PARTICLE SYSTEM ─────────────────────────
(function initParticles() {
    const canvas = ELEMENTS.particlesCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const COUNT = 60;
    const COLORS = ['rgba(255,107,53,0.5)', 'rgba(0,217,255,0.5)', 'rgba(167,139,250,0.5)', 'rgba(74,222,128,0.4)'];

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * w, y: Math.random() * h,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.3,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: Math.random() * 0.5 + 0.2,
            pulse: Math.random() * Math.PI * 2,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.dx; p.y += p.dy;
            p.pulse += 0.02;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(/[\d.]+\)$/, a + ')');
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

// ─── DATA RAIN (Matrix style) ────────────────
(function initDataRain() {
    const canvas = ELEMENTS.dataRain;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, cols, drops;
    const CHARS = '01アイウエオカキクケコ{}[];:<>/=+-';
    const FONT_SIZE = 12;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        cols = Math.floor(w / FONT_SIZE);
        drops = Array(cols).fill(1).map(() => Math.random() * -100);
    }
    window.addEventListener('resize', resize);
    resize();

    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 16, 0.08)';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#00d9ff';
        ctx.font = FONT_SIZE + 'px "JetBrains Mono", monospace';
        for (let i = 0; i < cols; i++) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
            if (drops[i] * FONT_SIZE > h && Math.random() > 0.975)
                drops[i] = 0;
            drops[i] += 0.5;
        }
        requestAnimationFrame(draw);
    }
    draw();
})();


// ═══════════════════════════════════════════════
// DATA FETCHING
// ═══════════════════════════════════════════════

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

        // 2. Uptime — animated counter
        if (ELEMENTS.uptime) ELEMENTS.uptime.innerText = formatUptime(data.uptime);

        // 3. Memory
        if (data.memory) {
            const heapUsed = data.memory.heapUsed || 0;
            const rss = data.memory.rss || 0;
            const limit = 536870912; // 512 MB

            if (ELEMENTS.heapVal) ELEMENTS.heapVal.innerText = formatBytes(heapUsed);
            if (ELEMENTS.heapUsed) ELEMENTS.heapUsed.innerText = formatBytes(heapUsed);
            if (ELEMENTS.rssVal) ELEMENTS.rssVal.innerText = formatBytes(rss);

            const heapPct = Math.min((heapUsed / limit) * 100, 100);
            if (ELEMENTS.heapBar) ELEMENTS.heapBar.style.width = `${heapPct}%`;

            const rssPct = Math.min((rss / limit) * 100, 100);
            if (ELEMENTS.rssBar) ELEMENTS.rssBar.style.width = `${rssPct}%`;
        }

        // 4. DB
        if (data.dbConnection && ELEMENTS.dbStatus) {
            ELEMENTS.dbStatus.innerText = 'Connected';
            if (ELEMENTS.dbContainer) ELEMENTS.dbContainer.classList.remove('status-offline');
        } else {
            if (ELEMENTS.dbStatus) ELEMENTS.dbStatus.innerText = 'Disconnected';
            if (ELEMENTS.dbContainer) ELEMENTS.dbContainer.classList.add('status-offline');
        }

        // 5. Global badge
        if (ELEMENTS.globalStatus) {
            ELEMENTS.globalStatus.innerText = '● OPERATIONAL';
            ELEMENTS.globalStatus.style.color = '#4ade80';
        }

    } catch (e) {
        console.error('Health fetch error:', e);
        if (ELEMENTS.globalStatus) { ELEMENTS.globalStatus.innerText = '● OFFLINE'; ELEMENTS.globalStatus.style.color = '#ef4444'; }
        if (ELEMENTS.dbContainer) ELEMENTS.dbContainer.classList.add('status-offline');
        if (ELEMENTS.dbStatus) ELEMENTS.dbStatus.innerText = 'Connection Failed';
    }
}

async function fetchAnalytics() {
    try {
        const res = await fetch('/api/admin/stats');
        if (res.status === 401) return;
        const data = await res.json();

        if (data) {
            const errEl = document.getElementById('error-rate-val');
            if (errEl) {
                animateValue(errEl, data.errorRate || 0, '%');
                const card = document.getElementById('error-card');
                if (card) card.style.borderColor = parseFloat(data.errorRate) > 5 ? '#ef4444' : '';
            }
            const ordersEl = document.getElementById('orders-today-val');
            if (ordersEl) animateValue(ordersEl, data.ordersToday || 0);
        }
    } catch (e) {
        console.error('Analytics error:', e);
    }
}

// ─── INIT ─────────────────────────────────────
fetchHealth();
fetchAnalytics();
setInterval(fetchHealth, 5000);
setInterval(fetchAnalytics, 15000);
