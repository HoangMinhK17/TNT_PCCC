import mongoose from "mongoose";

const leaderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    name_en: {
        type: String,
    },
    position: {
        type: String,
        required: true
    },
    position_en: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    description_en: {
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model("Leader", leaderSchema);