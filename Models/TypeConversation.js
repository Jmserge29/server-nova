import { Schema, model } from "mongoose";

const typeConversationSchema = new Schema(
    {
        type_identify: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
      timestamps: true,
      versionkey: false,
    }
)

export default model("TypeConvesartion", typeConversationSchema)