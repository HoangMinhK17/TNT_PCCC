import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    name_en: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    title_en: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    description_en: {
        type: String
    },
    image: {
        type: String
    },
    date: {
        type: Date
    },
    slug: {
        type: String,
        required: true
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
    }
},
    {
        timestamps: true
    }
);

projectSchema.index({ status: 1, isDeleted: 1, createdAt: -1 })
projectSchema.index({ isDeleted: 1, createdAt: -1 })
projectSchema.index({ name: 1 })
projectSchema.index(
    { slug: 1 },
    {
        unique: true,
        partialFilterExpression: { isDeleted: false }
    }
);

export default mongoose.model("Project", projectSchema);