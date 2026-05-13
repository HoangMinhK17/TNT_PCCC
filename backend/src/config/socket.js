import { Server } from "socket.io";

let io = null;

const deviceSocketMap = new Map();

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        socket.on("register", ({ userId, deviceId }) => {
            if (!deviceId) return;
            deviceSocketMap.set(String(deviceId), socket.id);
        });

        socket.on("disconnect", () => {
            for (const [deviceId, socketId] of deviceSocketMap.entries()) {
                if (socketId === socket.id) {
                    deviceSocketMap.delete(deviceId);
                    break;
                }
            }
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io chưa được khởi tạo!");
    return io;
};

export const emitForceLogout = (deviceId, reason = "Phiên đăng nhập của bạn đã bị đăng xuất bởi quản trị viên.") => {
    if (!io || !deviceId) return;
    const socketId = deviceSocketMap.get(String(deviceId));
    if (socketId) {
        io.to(socketId).emit("force_logout", { reason });
    }
};
