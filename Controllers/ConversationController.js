import Conversation from "../Models/Conversation.js";
import TypeConversation from "../Models/TypeConversation.js";
import User from "../Models/User.js";
import CtrlSolicitude from "./SolicitudeController.js"

// CHECK
const createConversation = async(req, res )=> {
  try {
    const {subject, creater_conversation, typeConversation} = req.body
    
    // Validation this object TypeConversation
    const searchType = await TypeConversation.findOne({ type_identify: typeConversation})
    if(searchType.length==0) return res.status(400).json({messageError: "The type conversations is invalid"})

    // Validation creater Convesation => (Username)
    const userCreater = await User.findOne({username: creater_conversation}, {password:0, roles: 0, permissions:0, privacy_settings:0, solicitude_me:0, solicitude_sender:0})

    if(!userCreater) return res.status(404).json({messageError: "The credentials invalid!"})

    // Validation for Error Duplicate Subject Conversations
    const subjectsConversations = userCreater.conversations.map((data) => data.conversations_name)
    const response = subjectsConversations.includes(subject)
    if(response) return res.status(400).json({messagError: "The Subject already exist, try again with another subject, please"})
    
    const conversationCreate = new Conversation({
      subject,
      status: false,
      typeConvesation: searchType._id,
      messages: [],
      participants: [{user_id: userCreater._id,
        username: userCreater.username,
        email: userCreater.email,}],
      solicitudes_participants: [],
      creater_conversation: creater_conversation
    })
    
    // var participantsArray=[]
    // if(participants) {
    //   await Promise.all(participants.map(async(data)=>{
      //     var aux = await User.findOne({email: data}, {password:0, birthdate:0, permissions:0, conversations:0, privacy_settings:0, updatedAt:0, createdAt:0, preferences:0, roles:0, phone_number:0, activity_history:0})
      //     if(aux== null) return res.status(400).json({messageError: "The participant input invalid"})
      //     participantsArray.push({user_id: aux._id, username: aux.username, email: aux.email})
      //     conversationCreate.participants = participantsArray
      //   }))
      //   console.log(conversationCreate.participants)
      // }
      const conversationcreated = await conversationCreate.save()
      
      // Add Conversation in the register the user Created Conversation
      userCreater.conversations.push(
        {
          conversations_id: conversationcreated._id,
          conversations_name: conversationcreated.subject,
        }
      )
      const userUpdated = await User.updateOne({_id: userCreater._id}, { $set: { conversations : userCreater.conversations}})
      if(userUpdated.modifiedCount == 0) return res.status(400).json({messagError: "The user hasn't been updated"})

      console.log("The conversation has been added register of user creater!")

      return res.status(200).json({success: true, data: conversationcreated})
      
    } catch (error) {
    console.log("The server has been an error :(")
  }
}

// CHECK
const getConversationsById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).catch(
      (error) => {
        console.log(error);
        return res
          .status(400)
          .json({ success: false, message: "The conversation not found" });
      }
    );
    if(!conversation)return res
    .status(400)
    .json({ success: false, message: "The conversation not found" });

    return res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    console.log(`An error has ocurred in the server :(\nThe erro is ${error}`);
  }
};

// CHECK
const getsConversationsAll = async (req, res) => {
  try {
    const conversations = await Conversation.find({}).catch((error) => {
      console.log(error);
      return res.status(400).json({ success: false, error: error });
    });

    if (!conversations.length) {
      return res.status(404).json({
        success: false,
        message: `conversations not found`,
      });
    }
    return res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    console.log(`An error has ocurred in the server :(\nThe erro is ${error}`);
  }
};

// CHECK
const updateConversationById = async(req, res) => {
  try {
    const {id} = req.params
    const conversation = await Conversation.findById(id)
    if(!conversation || conversation== null) return res.status(404).json({messagError: "The Conversation not found"})

    const {subject, creater_conversation, typeConversation} = req.body
    const user = await User.findOne({username: creater_conversation}).catch((error) => {
      console.log(error)
      return res.status(400).json({messagError: "Error credentials"})
    })
    if(!user) return res.status(404).json({messagError: "The invalid credentials"})
    if(!conversation.creater_conversation == creater_conversation) return res.status(401).json({messagError: "Unathorized"})

    const conversationsArray = user.conversations.map((data) => data.conversations_name)
    const response = conversationsArray.includes(subject)
    if(response) return restart.status(400).json({messagError: "The subject alredy exist, try again with another subject, please"})

    const type = await TypeConversation.findOne({type_identify: typeConversation}).catch((error) => {
      console.log(error)
      return res.status(400).json({messagError: "Error credentials"})
    })
    if(!type) return res.status(404).json({messagError: "The type conversational not found"})

    const conversationUpdate = await Conversation.updateOne({_id: id}, { $set: {subject: subject, typeConvesation: type}})
    if(conversationUpdate.modifiedCount == 0) return res.status(400).json({messagError: "The user hasn't been updated"})

    const conversationUpdated = await Conversation.findById(id)

    console.log("The Conversation has been updated!")
    return res.status(200).json({success: true, data: conversationUpdated})
  } catch (error) {
    console.log("The server has beena an error :(", error)
  }
}

// CHECK
const addParticipant = async(req, res) => {
  try {
    // Search the Cnversation for id in the params
    const {id} = req.params
    const conversationObject = await Conversation.findById(id)
    if(!conversationObject) return res.status(404).json({messageError: "The id conversation is invalid!"})
    // console.log(conversationObject)
    // Data updating in the body (participant) ==> username
    const {participant, user_id} = req.body

    const userCreater = await User.findById(user_id)
    if(!userCreater) return res.status(404).json({messagError: "The user provided not found"})
    if(!conversationObject.creater_conversation == userCreater.username) return res.status(401).json({messagError: "Unauthorized!"})

    // Validation Depending Type Conversation
    // Getting _id Object the typeconversational for validation
    const type = await TypeConversation.findById(conversationObject.typeConvesation)
    switch (type.type_identify) {
      case "chat_personal":
        // Validations
        if(conversationObject.participants.length>1) return res.status(400).json({messagError: "This conversation cannot exceed the limit of (2 participant)"})
        if(participant.length>1) return res.status(400).json({messagError: "This conversation cannot exceed the limit of (2 participant)"})
        const userAdd = await User.findOne({username: participant[0]})
        if(!userAdd) return res.status(400).json({messagError: "The participant provided wasn't found"})
        if(conversationObject.participants[0].user_id.equals(userAdd._id)) return res.status(400).json({messagError: "The user provided already belong to this conversation"})

        // Add participant in conversation ==> Create Solicitude Enter
        req.body.sender_id = user_id
        req.body.username_destination = participant[0]
        req.body.conversation_id = id
        await CtrlSolicitude.createSolicitude(req, res)
        break;

      case 'group_identify':
        //Validations
        if(participant.length>30) return res.status(400).json({messagError: "This conversation cannot exceed the limit of (30 participant)"})

        // Add participant in conversation ==> Create Solicitude Enter
        req.body.sender_id = user_id
        await CtrlSolicitude.createManySolicitudes(req, res)
        break;
      // Prototype
      case 'chat_nova_random':
        return res.status(200).json({success: true, data: "The fuction isn't avaible"})
        break;
      default:
        return res.status(404).json({messagError: "The typeConversation doesn't belong to any type conversation exists (FATAL ERROR)"})
    }
  } catch (error) {
    console.log("The server has been an error", error)
  }
}

// Eliminar Solicitudes Participantes y mensajes
const deleteConversationById = async(req, res )=> {
  try {
    const {id} = req.params
    const conversation = await Conversation.findById(id)
    if(!conversation) return res.status(404).json({success: false, messagError: "The conversation wasn't found"})

    const {conversationCreater} = req.body
    const userCreater = await User.findById(conversationCreater)

    if(!userCreater) return res.status(404).json({messagError: "Error, The user not found", success: false})
    console.log(conversation.creater_conversation)
    console.log(userCreater.username)
    if(!(conversation.creater_conversation === userCreater.username)) return res.status(400).json({messagError: "Unauthorized!"})


    // Delete Messenges this Conversation

    // Delete Solicitudes this Conversation

    // Delete Participants id conversation (FULL)

    res.status(200).json({success: true, data: `The conversation ( ${conversation.subject} ) delete succesly!`})
  } catch (error) {
    console.log("An error has been in the server :(", error)
  }
}

export default {
  getsConversationsAll,
  getConversationsById,
  createConversation,
  addParticipant,
  updateConversationById,
  deleteConversationById
};
