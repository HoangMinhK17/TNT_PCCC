import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    name_en: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
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
    image: {
        type: String
    },
    categoryNewsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoryNews",
        default: null
    },
    slug: {
        type: String,
        required: true,
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

newsSchema.index({ status: 1, isDeleted: 1, createdAt: -1 })
newsSchema.index({ isDeleted: 1, createdAt: -1 })
newsSchema.index({ name: 1 })
newsSchema.index(
    { slug: 1 },
    {
        unique: true,
        partialFilterExpression: { isDeleted: false }
    }
);

export default mongoose.model("News", newsSchema);