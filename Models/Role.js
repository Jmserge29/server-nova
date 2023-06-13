import {Schema, model } from 'mongoose'

const roleSchema = new Schema(
    {
        role: String
    },
    {
        versionKey: false
    }
);

export default model("Role", roleSchema);