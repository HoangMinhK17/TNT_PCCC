import mongoose from "mongoose";


const recruitmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
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

    benefits: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }],
    whyChooseUs: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }],
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
    
},
{
    timestamps: true
}
);

export default mongoose.model("Recruitment", recruitmentSchema);
