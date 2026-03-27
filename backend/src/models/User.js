import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },  
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "admin"
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    theme: {
        type: String,
        enum: [
            // New theme IDs
            'corporate-red', 'ocean-blue', 'forest-green',
            'midnight-dark', 'warm-gold', 'pure-minimal',
            // Legacy theme IDs (backward compat)
            'light', 'dark', 'blue', 'green', 'ocean', 'forest', 'sunset', 'minimal'
        ],
        default: 'corporate-red'
    }
},
{
    timestamps: true
}
);

export default mongoose.model("User", userSchema);