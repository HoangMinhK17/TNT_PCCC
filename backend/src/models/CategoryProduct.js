import mongoose from "mongoose";

const categoryProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    name_en: {
        type: String,
        trim: true
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

categoryProductSchema.index({ status: 1, isDeleted: 1, createdAt: -1 })
categoryProductSchema.index({ isDeleted: 1, createdAt: -1 })
categoryProductSchema.index({ name: 1 })


export default mongoose.model("CategoryProduct", categoryProductSchema);
