import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    deviceId: String,

    ip: String,
    browser: String,
    os: String,
    platform: String,

    refreshToken: String,

    lastActive: Date,

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);