import mongoose from "mongoose";

const whyChooseServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    title_en: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    description_en: {
        type: String,
    },
    icon: {
        type: String,
        required: true
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
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    deletedAt: {
        type: Date,
        default: null
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model("WhyChooseService", whyChooseServiceSchema);