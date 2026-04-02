import mongoose from "mongoose";

const themeHeaderSchema = new mongoose.Schema({
    background_color: {
        type: String,
        default: "#fff"
    },
    text_color: {
        type: String,
        default: "#000"
    },
    text_size: {
        type: String,
        default: "14px"
    }




},
    { timestamps: true }
)

const ThemeHeader = mongoose.model("ThemeHeader", themeHeaderSchema);
export default ThemeHeader;
