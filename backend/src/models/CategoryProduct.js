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
    },
    displayOrder: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    }
);

categoryProductSchema.index({ status: 1, isDeleted: 1, displayOrder: 1 })
categoryProductSchema.index({ isDeleted: 1, displayOrder: 1 })
categoryProductSchema.index({ name: 1 })
categoryProductSchema.index({ displayOrder: 1 })
categoryProductSchema.index(
    { slug: 1 },
    {
        unique: true,
        partialFilterExpression: { isDeleted: false }
    }
);

export default mongoose.model("CategoryProduct", categoryProductSchema);
