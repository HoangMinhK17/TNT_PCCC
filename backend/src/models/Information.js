import mongoose from "mongoose";

const informationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
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
    logo: {
        type: String,
        required: true
    },
    backgroundImage: {
        type: [String],
        required: true
    },
    socialLinks: [  {
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    
    
},  
{
    timestamps: true
}
);

export default mongoose.model("Information", informationSchema);