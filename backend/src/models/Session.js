import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    deviceId: {
        type: String
    },
    ip: {
        type: String
    },
    browser: {
        type: String
    },
    os: {
        type: String
    },
    platform: {
        type: String
    },
    refreshToken: {
        type: String
    },
    lastActive: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, 
    {
        timestamps: true
    }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;