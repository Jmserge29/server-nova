import { Schema, model  } from "mongoose";

const solicitudeSchema = new Schema(
    {
        sender_id : {
            username: {
                type: Schema.Types.String,
                require: true    
            },
            id: {
                type: Schema.Types.ObjectId,
                require: true
            }
        },
        username_destination: {
            type: Schema.Types.String,
            require: true
        },
        conversation_id: {
            type: Schema.Types.ObjectId,
            require: true
        }, 
        response: {
            type: Schema.Types.String,
            require: true
        }
    }
)

export default model("Solicitude", solicitudeSchema)