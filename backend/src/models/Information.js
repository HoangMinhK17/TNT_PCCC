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
    socialLinks: [{
        name: {
            type: String,
        },
        url: {
            type: String,
        },
        icon: {
            type: String,
        }
    }],
    updateBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    timeWork: {
        type: [String],
        required: false
    },
    favicon: {
        type: String
    },
    chatConfig: {
        scriptUrl: {
            type: String,
            default: ""
        },
        token: {
            type: String,
            default: ""
        },
        imageChat: {
            type: String,
        },
        enable: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            default: "Chat Hỗ Trợ"
        },
        externalChatConfig: {
            enable: {
                type: Boolean,
                default: false
            },
            url: {
                type: String,
                default: ""
            }
        }
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model("Information", informationSchema);