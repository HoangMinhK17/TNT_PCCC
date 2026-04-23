import mongoose from "mongoose";

const categoryNewsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    name_en: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    deletedAt: {
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },


},
    {
        timestamps: true
    }
);
categoryNewsSchema.index({ status: 1, isDeleted: 1, createdAt: -1 })
categoryNewsSchema.index({ isDeleted: 1, createdAt: -1 })
categoryNewsSchema.index({ name: 1 })


export default mongoose.model("CategoryNews", categoryNewsSchema);