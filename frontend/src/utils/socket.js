import { io } from "socket.io-client";

let socket = null;

export const initSocket = () => {
    if (socket) return socket;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

    socket = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
    });

    return socket;
};

export const getSocket = () => socket;

export const registerUser = (userId, deviceId) => {
    if (socket && userId && deviceId) {
        socket.emit("register", { userId, deviceId });
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
