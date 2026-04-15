import mongoose from "mongoose";


const recruitmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    name_en: {
        type: String,
    },
    level: {
        type: String,
        required: true
    },
    level_en: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    location_en: {
        type: String,
    },
    salary: {
        type: String,
        required: true
    },
    salary_en: {
        type: String,
    },
    time: {
        type: String,
        required: true
    },
    time_en: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    requirements: {
        type: [String],
        default: []
    },
    requirements_en: {
        type: [String],
        default: []
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

export default mongoose.model("Recruitment", recruitmentSchema);
