import { Schema, model } from "mongoose";
import {notificationSettingsSchema, preferencesSchema, privacySettingsSchema} from "./User.js"

const userProviderSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        full_name: {
            type: String,
        },
        birthdate: {
            type: String,
        },
        phone_number: {
            type: Number,
        },
        // // address: {
        // //   street: "123 Main St",
        // //   city: "Ciudad",
        // //   state: "Estado",
        // //   country: "País",
        // //   zip_code: "12345",
        // // },
        preferences: preferencesSchema,
        privacy_settings: privacySettingsSchema,
        activity_history: {
          last_login: {
            type: String,
            require: true,
        },
          last_message: {
            id: {
            type: String,
            require: true,
        },
            content: {
            type: String,
            require: true,
            unique: false
        },
            timestamp: {
            type: String,
            require: true,
            unique: false
        },
            channel_id: {
            type: String,
            require: true,
            unique: false
        },
          },
          total_messages_sent: {
            type: Number,
            require: true,
            unique: false
        },
          total_files_uploaded: {
            type: Number,
            require: true,
            unique: false
        },
          total_friends: {
            type: Number,
            require: true,
            unique: false
        },
        },
        usage_statistics: {
          total_time_on_platform: {
            type: String,
            require: true,
            unique: false
        },
          followers_count: {
            type: Number,
            require: true,
            unique: false
        },
          following_count: {
            type: Number,
            require: true,
            unique: false
        },
        },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Role"
            },
        ],
        permissions: {
          can_post_messages: {
            type: Boolean,
            require: true,
        },
          can_create_channels: {
            type: Boolean,
            require: true,
        },
          can_invite_users: {
            type: Boolean,
            require: true,
        },
        },
        conversations: [
          {
            conversations_id: {
              type: Schema.Types.ObjectId,
              require: true
            },
            conversations_name: {
              type: String,
              require: true
            }
          }
        ],
        provider: {
          type: String,
          require: true
        }
      },
      {
        timestamps: true,
        versionkey: false,
      }
    )

export default model("UserProvider", userProviderSchema)