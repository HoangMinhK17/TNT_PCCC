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

contactRecruitmentSchema.index({ status: 1, isDeleted: 1, createdAt: -1 })
contactRecruitmentSchema.index({ isDeleted: 1, createdAt: -1 })
contactRecruitmentSchema.index({ name: 1 })
contactRecruitmentSchema.index({ phone: 1 })

export default mongoose.model("ContactRecruitment", contactRecruitmentSchema) 
