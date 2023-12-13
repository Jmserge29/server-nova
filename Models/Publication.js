import { Schema, model } from "mongoose";

const schemaPublication = new Schema(
    {
        idCreator: {
            type: Schema.Types.ObjectId,
            require: true
        },
        date: {
            type: String
        },
        content: [
            {
                description: String,
                images: [{type: Schema.Types.String}],
                mentions: [
                    {type: Schema.Types.ObjectId}
                ]
            }
        ],
        featured : Boolean
    },
    {
        timestamps: true
    }
)

export default model("Publication", schemaPublication)