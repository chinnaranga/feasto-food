import { useEffect, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5001";

export function useOrderSocket(orderId) {
    const [status, setStatus] = useState("PLACED");

    useEffect(() => {
        if (!orderId) return;

        let ws = null;
        let keepAliveInterval = null;

        const connect = () => {
            ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                console.log("WS Connected for Order:", orderId);
                ws.send(JSON.stringify({
                    type: "SUBSCRIBE_ORDER",
                    orderId
                }));

                // Keep connection alive
                keepAliveInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: "PING" }));
                    }
                }, 30000);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "ORDER_STATUS_UPDATE") {
                        setStatus(data.status);
                    }
                } catch (e) {
                    console.error("WS Parse Error", e);
                }
            };

            ws.onclose = () => {
                console.log("WS Closed");
                clearInterval(keepAliveInterval);
            };
        };

        connect();

        return () => {
            if (ws) ws.close();
            if (keepAliveInterval) clearInterval(keepAliveInterval);
        };
    }, [orderId]);

    return status;
}
