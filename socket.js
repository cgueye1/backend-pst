import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const userSockets = new Map();

export function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            credentials: true
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Unauthorized"));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.data.userId = decoded.user_id;
            next();
        } catch (err) {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        userSockets.set(socket.data.userId, socket.id);

        socket.on("join_conversations", (ids) => {
            ids.forEach((id) => socket.join(`conversation_${id}`));
        });

        socket.on("disconnect", () => {
            userSockets.delete(socket.data.userId);
        });
    });

    global.io = io;
    global.userSockets = userSockets;
}
