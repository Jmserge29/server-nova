import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
    {
    subject: {
        type: String,
        require: true,
    },
    status: {
        type: Schema.Types.Boolean,
    },
    typeConvesation: {
        type: Schema.Types.ObjectId,
        ref: "TypeConvesartion",
        require: true,
    },
    creater_conversation: {
        type: Schema.Types.ObjectId,
        require: true
    },
    solicitudes_participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "Solicitude"
        }
    ],
    participants: [
        {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        username: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true
        }
        },
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    },
    {
    timestamps: true,
    versionkey: false,
    }
);  
export default model("Conversation", conversationSchema);
