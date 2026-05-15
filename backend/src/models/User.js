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
        enum: ["admin", "staff", "user"],
        default: "user"
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    theme: {
        type: String,
        enum: [
            'corporate-red', 'ocean-blue', 'forest-green',
            'midnight-dark', 'warm-gold', 'pure-minimal', 'ai-teal'
        ],
        default: 'corporate-red'
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);