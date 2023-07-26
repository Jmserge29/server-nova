import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
const messageSchema = new Schema(
    {
        // conversation_id: {
        //     type: Schema.Types.ObjectId,
        //     require: true
        // },
        sender_id: {
            type: Schema.Types.ObjectId,
            require: true
        },
        content:{
            type: String,
            require: true
        },
        timestamp:{
            type: String,
            require: true
        },
        // "attachments": [
        //     {
        //       "id": "1",
        //       "type": "image",
        //       "url": "https://example.com/image.jpg"
        //     },
        //     {
        //       "id": "2",
        //       "type": "file",
        //       "url": "https://example.com/document.pdf"
        //     }
        //   ],
        reactions:[
            {
                emoji: {
                    type: String
                },
                users: [{
                    type: Schema.Types.ObjectId,
                    ref: "user"
                }]
            }
        ]
    },
    {
        timestamps: true,
        versionkey: false,
    }

)

    // FuctionsDev
    // Encrypt message the User
    messageSchema.statics.encryptMessage = async (message) => {
        const salt = await bcrypt.genSalt(16);
        return await bcrypt.hash(message, salt);
    };
    // Comparer messages the User
    messageSchema.statics.compareMessage = async (message, reveicedMessage) => {
        return await bcrypt.compare(message, reveicedMessage);
    };  

export default model("Message", messageSchema)