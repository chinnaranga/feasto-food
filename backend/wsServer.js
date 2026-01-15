import { WebSocketServer } from "ws";

export function initWebSocket(server) {
    const wss = new WebSocketServer({ server });

    const rooms = new Map(); // orderId → Set<ws>

    wss.on("connection", (ws) => {
        console.log("🔌 New WS Connection");

        ws.on("message", (msg) => {
            try {
                const data = JSON.parse(msg);

                if (data.type === "SUBSCRIBE_ORDER") {
                    const { orderId } = data;
                    if (!orderId) return;

                    if (!rooms.has(orderId)) {
                        rooms.set(orderId, new Set());
                    }

                    rooms.get(orderId).add(ws);
                    ws.orderId = orderId;
                    console.log(`✅ Client subscribed to order: ${orderId}`);
                }
            } catch (err) {
                console.error("WS Message Error:", err);
            }
        });

        ws.on("close", () => {
            if (ws.orderId && rooms.has(ws.orderId)) {
                rooms.get(ws.orderId).delete(ws);
                if (rooms.get(ws.orderId).size === 0) {
                    rooms.delete(ws.orderId);
                }
            }
        });
    });

    return {
        notifyOrderUpdate(orderId, payload) {
            if (!orderId || !rooms.has(orderId)) return;

            const clients = rooms.get(orderId);
            const message = JSON.stringify(payload);

            console.log(`📡 Broadcasting update for ${orderId}:`, payload.status);

            clients.forEach(ws => {
                if (ws.readyState === 1) { // OPEN
                    ws.send(message);
                }
            });
        }
    };
}
