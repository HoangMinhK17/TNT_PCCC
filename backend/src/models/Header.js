import mongoose from "mongoose";

const headerSchema = new mongoose.Schema({

    key: {
        type : String,
        required : true
    },
    name_en: {
        type : String,
        required : true
    },
    name_vn: {
        type : String,
        required : true
    },
    status : {
        type : String,
        default : "active"
    },
    show_home : {
        type : String,
        default : "active"
    }
    
},
{
    timestamps : true
}
)

export default mongoose.model("Header", headerSchema);