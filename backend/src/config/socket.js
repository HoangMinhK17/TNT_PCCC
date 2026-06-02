import { Server } from "socket.io";

let io = null;

// Key: "userId:deviceId" → đảm bảo mỗi (user + thiết bị) có entry riêng biệt
// Tránh trường hợp hai tài khoản khác nhau trên cùng trình duyệt ghi đè nhau
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
            if (!deviceId || !userId) return;
            const key = `${String(userId)}:${String(deviceId)}`;
            deviceSocketMap.set(key, socket.id);
        });

        socket.on("disconnect", () => {
            for (const [key, socketId] of deviceSocketMap.entries()) {
                if (socketId === socket.id) {
                    deviceSocketMap.delete(key);
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

export const emitForceLogout = (deviceId, reason = "Phiên đăng nhập của bạn đã bị đăng xuất bởi quản trị viên.", sessionUserId = null) => {
    if (!io || !deviceId) return;
    // Dùng composite key để đảm bảo emit đúng user+device
    if (sessionUserId) {
        const key = `${String(sessionUserId)}:${String(deviceId)}`;
        const socketId = deviceSocketMap.get(key);
        if (socketId) {
            io.to(socketId).emit("force_logout", { reason });
        }
    } else {
        // Fallback: tìm theo deviceId (backwards compatibility)
        for (const [key, socketId] of deviceSocketMap.entries()) {
            if (key.endsWith(`:${String(deviceId)}`)) {
                io.to(socketId).emit("force_logout", { reason });
                break;
            }
        }
    }
};
