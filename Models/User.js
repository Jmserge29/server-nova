import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'

const notificationSettingsSchema = new Schema({
  email: Boolean,
  sms: Boolean,
  push: Boolean
});

const preferencesSchema = new Schema({
  notification_settings: notificationSettingsSchema,
  language:  {
    type: String,
    required: false,
  },
  timezone: {
    type: String,
    required: false,
  }
});

const privacySettingsSchema = new Schema({
  profile_visibility: {
    type: String,
},
  contact_info_visibility: {
    type: String,
    required: true,
}
});

const userSchema = new Schema(
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
    password: {
        type: String,
        require: true,
        unique: false
    },
    full_name: {
        type: String,
        required: true
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
  },
  {
    timestamps: true,
    versionkey: false,
  }
);

// FuctionsDev
// Encrypt password the User
userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
};
// Comparer Passwords the User 
userSchema.statics.comparePassword = async (password, reveicedPassword) => {
    return await bcrypt.compare(password, reveicedPassword)
}



export default model("User", userSchema);
