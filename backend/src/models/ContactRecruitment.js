import mongoose from "mongoose";


const contactRecruitmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    cv: {
        type: String,
        required: true
    },

    recruitmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recruitment",
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    note: {
        type: String,
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

)


export default mongoose.model("ContactRecruitment", contactRecruitmentSchema) 
