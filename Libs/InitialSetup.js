//Imports models
import Role from "../Models/Role.js";
import TypeConversation from "../Models/TypeConversation.js";
import Message from "../Models/Message.js";
import User from "../Models/User.js";
import moment from "moment/moment.js";
import Conversation from "../Models/Conversation.js";

var time = moment().format("MMMM Do YYYY, h:mm:ss a");
//Exporting fuctions creatings setup
export const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count > 0) return;

    // Creating roles the users
    const values = await Promise.all([
      new Role({ role: "user" }).save(),
      new Role({ role: "moderator" }).save(),
      new Role({ role: "admin" }).save(),
    ]);
    console.log(values);
    console.log("Roles created success!");
  } catch (error) {
    console.log(error);
  }
};

export const createTypesConversations = async () => {
  try {
    const count = await TypeConversation.estimatedDocumentCount();
    if (count > 0) return;

    // Creating types of conversations
    const valuesTypes = await Promise.all([
      new TypeConversation({ type_identify: "group_identify" }).save(),
      new TypeConversation({ type_identify: "chat_personal" }).save(),
      // Prototype
      new TypeConversation({ type_identify: "chat_nova_random" }).save(),
    ]);
    console.log(valuesTypes);
    console.log("Types Conversationals has been created success!");
  } catch (error) {
    console.log("The server has been an error: ", error);
  }
};

export const createMessageWelcome = async () => {
  try {
    const count = await Message.estimatedDocumentCount();
    if (count > 0) return;

    const senderUser = await User.findOne({ email: "Dev$01@gmail.com" });
    const message = await new Message({
      sender_id: senderUser._id,
      content: "Hellow, Welcome to the plataform Nova-App",
      timestamp: time,
      reactions: [
        {
          emoji: "🤩",
          users: [senderUser._id],
        },
      ],
    }).save();

    console.log(message);
    console.log("The Message of the Welcome has been created success!");
  } catch (error) {
    console.log("The server has been an error: ", error);
  }
};

export const createUsers = async () => {
  try {
    const count = await User.estimatedDocumentCount();
    if (count > 0) return;

    const roleAdmin = await Role.findOne({ role: "admin" });
    const roleModerator = await Role.findOne({ role: "moderator" });
    const roledev = await Role.findOne({ role: "user" });

    const passwordEncrypted = await User.encryptPassword("123456789")

    // Creating users Defaults (Admin, moderator, user and senderUser)
    const values = await Promise.all([
      new User({
        picture: "data:image/svg+xml;utf8,%3Csvg%20viewBox%3D%22-1.5%20-1.5%208%208%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22hsl(0%2090%25%2045%25)%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%221%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%224%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%221%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%224%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3C%2Fsvg%3E",
        username: "Admin$dev01",
        email: "Admin$dev01@gmail.com",
        password: passwordEncrypted,
        full_name: "",
        roles: [roleAdmin._id],
        birthdate: "null",
        phone_number: 0,
        preferences: {
          notification_settings: {
            email: true,
            sms: false,
            push: true,
          },
          language: "",
          timezone: "",
        },
        privacy_settings: {
          profile_visibility: "public",
          contact_info_visibility: "friends_only",
          solicitude_autoFollowing: false,
        },
        activity_history: {
          last_login: time,
          last_message: {
            id: "",
            content: "",
            timestamp: "",
            channel_id: "",
          },
          total_messages_sent: 0,
          total_files_uploaded: 0,
          total_friends: 0,
        },
        usage_statistics: {
          total_time_on_platform: "0h",
          followers_count: 0,
          following_count: 0,
        },
        permissions: {
          can_post_messages: true,
          can_create_channels: false,
          can_invite_users: true,
        },
        solicitude_sender: [],
        solicitude_me: [],

      }).save(),
      new User({
        picture: "data:image/svg+xml;utf8,%3Csvg%20viewBox%3D%22-1.5%20-1.5%208%208%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22hsl(40%2090%25%2045%25)%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%222%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%224%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%222%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%224%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%222%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%224%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%221%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%222%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%224%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3C%2Fsvg%3E",
        username: "Dev$01",
        email: "Dev$01@gmail.com",
        password: passwordEncrypted,
        full_name: "",
        roles: [roledev._id],
        birthdate: "null",
        phone_number: 0,
        preferences: {
          notification_settings: {
            email: true,
            sms: false,
            push: true,
          },
          language: "",
          timezone: "",
        },
        privacy_settings: {
          profile_visibility: "public",
          contact_info_visibility: "friends_only",
          solicitude_autoFollowing: false,
        },
        activity_history: {
          last_login: time,
          last_message: {
            id: "",
            content: "",
            timestamp: "",
            channel_id: "",
          },
          total_messages_sent: 0,
          total_files_uploaded: 0,
          total_friends: 0,
        },
        usage_statistics: {
          total_time_on_platform: "0h",
          followers_count: 0,
          following_count: 0,
        },
        permissions: {
          can_post_messages: true,
          can_create_channels: false,
          can_invite_users: true,
        },
        solicitude_sender: [],
        solicitude_me: [],

      }).save(),
      new User({
        picture: "data:image/svg+xml;utf8,%3Csvg%20viewBox%3D%22-1.5%20-1.5%208%208%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22hsl(160%2090%25%2045%25)%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%222%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%224%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%221%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%224%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%222%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%224%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%221%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%2F%3E%3C%2Fsvg%3E",
        username: "Moderator$dev01",
        email: "Moderator$dev01@gmail.com",
        password: passwordEncrypted,
        full_name: "",
        roles: [roleModerator._id],
        birthdate: "null",
        phone_number: 0,
        preferences: {
          notification_settings: {
            email: true,
            sms: false,
            push: true,
          },
          language: "",
          timezone: "",
        },
        privacy_settings: {
          profile_visibility: "public",
          contact_info_visibility: "friends_only",
          solicitude_autoFollowing: false,
        },
        activity_history: {
          last_login: time,
          last_message: {
            id: "",
            content: "",
            timestamp: "",
            channel_id: "",
          },
          total_messages_sent: 0,
          total_files_uploaded: 0,
          total_friends: 0,
        },
        usage_statistics: {
          total_time_on_platform: "0h",
          followers_count: 0,
          following_count: 0,
        },
        permissions: {
          can_post_messages: true,
          can_create_channels: false,
          can_invite_users: true,
        },
        solicitude_sender: [],
        solicitude_me: [],
      }).save(),
    ]);
    console.log(values);
    console.log("The users defaults has been created success!");
  } catch (error) {
    console.log("The server has been an error: ", error);
  }
};

export const createInitialConversation = async () => {
  try {
    const count = await Conversation.estimatedDocumentCount();
    if (count > 0) return;

    const type = await TypeConversation.findOne({
      type_identify: "chat_personal",
    });
    const userWelcome = await User.findOne({email: "Dev$01@gmail.com"})
    const messageWelcome = await Message.findOne({content: "Hellow, Welcome to the plataform Nova-App"})

    console.log(messageWelcome)

    const conversation = await new Conversation({
      subject: "Welcome Chat",
      status: true,
      typeConvesation: type._id,
      solicitudes_participants: [],
      creater_conversation: "Dev$01",
      participants: [
        {
          user_id: userWelcome._id,
          username: userWelcome.username,
          email: userWelcome.email
        },
      ],
      messages: [
        messageWelcome._id
    ],
    }).save()

    console.log(conversation)
    console.log("The conversation Initial has been created success!")

  } catch (error) {
    console.log("The server has been an error: ", error);
  }
};
