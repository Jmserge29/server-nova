import { Schema, model, mongo } from "mongoose";

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

export default model("Message", messageSchema)