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
        enum: ['light', 'dark', 'blue', 'green'],
        default: 'light'
    }
},
{
    timestamps: true
}
);

export default mongoose.model("User", userSchema);