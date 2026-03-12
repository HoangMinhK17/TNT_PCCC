import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    }
    ,
    role:
    {
        type: String,
        required: true
    },
    company:
    {
        type: String,
        required: true
    },
    content:
    {
        type: String,
        required: true
    },
    rating:
    {
        type: Number,
        required: true
    },
    avatar:
    {
        type: String,
        required: true
    },
    status:
    {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    isDeleted:
    {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    }

);

export default mongoose.model("Testimonial", TestimonialSchema);