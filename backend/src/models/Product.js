import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    name_en: {
        type: String,
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
        type: [String]
    },
    technical: [{
        title: {
            type: String,
        },
        description: {
            type: String,
        },
    }],
    technical_en: [{
        title_en: {
            type: String,
        },
        description_en: {
            type: String,
        },
    }],
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoryProduct",
        required: true
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

export default mongoose.model("Product", productSchema);