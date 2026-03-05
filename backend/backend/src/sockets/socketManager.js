import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                process.env.CLIENT_URL,
                "http://localhost:5173",
                "http://localhost:3000",
                "https://food-platform-b022f.web.app",
            ],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("🔌 New client connected:", socket.id);

        socket.on("join", (userId) => {
            if (userId) {
                socket.join(userId);
                console.log(`👤 User ${userId} joined room`);
            }
        });

        socket.on("disconnect", () => {
            console.log("🔌 Client disconnected:", socket.id);
        });
    });

    return io;
};

export const emitNotification = (userId, notification) => {
    if (io) {
        io.to(userId).emit("notification", notification);
        console.log(`📢 Notification sent to user ${userId}`);
    } else {
        console.warn("⚠️ Socket.io not initialized. Cannot emit notification.");
    }
};

export const getIo = () => io;
