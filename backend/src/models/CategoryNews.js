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
categoryNewsSchema.index({ status: 1, isDeleted: 1, displayOrder: 1 })
categoryNewsSchema.index({ isDeleted: 1, displayOrder: 1 })
categoryNewsSchema.index({ name: 1 })
categoryNewsSchema.index({ displayOrder: 1 })
categoryNewsSchema.index(
  { slug: 1 },
    {
        unique: true,
        partialFilterExpression: { isDeleted: false }
    }
);

export default mongoose.model("CategoryNews", categoryNewsSchema);