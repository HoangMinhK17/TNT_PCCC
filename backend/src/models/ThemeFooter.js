import mongoose from "mongoose";

const themeFooterSchema = new mongoose.Schema(
  {
    background_color: {
      type: String,
      default: "#000",
    },
    text_title: {
      text_color: {
        type: String,
        default: "#fff",
      },
      text_size: {
        type: String,
        default: "18px",
      },
    },
    text_p: {
      text_color: {
        type: String,
        default: "#999",
      },
      text_size: {
        type: String,
        default: "14px",
      },
    },
    text_a: {
      text_color: {
        type: String,
        default: "#ccc",
      },
      text_size: {
        type: String,
        default: "14px",
      },
    },
    contact_text: {
      text_color: {
        type: String,
        default: "#ccc",
      },
      text_size: {
        type: String,
        default: "14px",
      },
    },
    icon_color: {
      type: String,
      default: "#fff",
    },
  },
  {
    timestamps: true 
  }
);

const ThemeFooter = mongoose.model("ThemeFooter", themeFooterSchema);
export default ThemeFooter;