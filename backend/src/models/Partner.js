import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({

    image: {
        type: [String],
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
    
},
{   
    timestamps: true
}
);

export default mongoose.model("Partner", partnerSchema);