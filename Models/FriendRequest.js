import { Schema, model } from "mongoose";

const friendRequest = new Schema(
    {
        userSender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        userDestination: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        timestamps: {
            type: Schema.Types.String,
            require: true
        },
        response: {
            type: Schema.Types.String,
            require: true
        }
    },
    {
        timestamps: true,
        versionkey: false,
    }
)

export default model("FriendRequest", friendRequest)