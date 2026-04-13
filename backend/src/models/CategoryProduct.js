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

export default mongoose.model("CategoryProduct", categoryProductSchema);
