import Conversation from "../Models/Conversation.js";
import TypeConversation from "../Models/TypeConversation.js";
import User from "../Models/User.js";

const createConversation = async(req, res )=> {
  try {
    const {subject, participants, typeConversation} = req.body
    
    // Validation this object TypeConversation
    const searchType = await TypeConversation.findOne({ type_identify: typeConversation})
    if(searchType.length==0) return res.status(400).json({messageError: "The type conversations is invalid"})

    const conversationCreate = new Conversation({
      subject,
      status: false,
      typeConvesation: searchType._id,
      messages: [],
    })

    var participantsArray=[]
    if(participants) {
      await Promise.all(participants.map(async(data)=>{
        var aux = await User.findOne({email: data}, {password:0, birthdate:0, permissions:0, conversations:0, privacy_settings:0, updatedAt:0, createdAt:0, preferences:0, roles:0, phone_number:0, activity_history:0})
        if(aux== null) return res.status(400).json({messageError: "The participant input invalid"})
        participantsArray.push({user_id: aux._id, username: aux.username, email: aux.email})
        conversationCreate.participants = participantsArray
      }))
      console.log(conversationCreate.participants)
    }
    const conversationcreated = await conversationCreate.save()

    console.log(conversationcreated)
    return res.status(200).json({success: true, data: conversationcreated})

  } catch (error) {
    console.log("The server has been an error :(")
  }
}

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

    return res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    console.log("Ha ocurrido un error en el servidor:(");
  }
};

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

const updateConversationById = async(req, res) => {
  try {
    const {id} = req.paramas.id
    const {subject, typeConversation} = req.body



  } catch (error) {
    console.log("The server has beena an error :(")
  }
}

const addParticipant = async(req, res) => {
  try {
    // Search the Cnversation for id in the params
    const {id} = req.paramas.id
    const conversationObject = await Conversation.findById(id)
    if(conversationObject.length === 0) return res.status(404).json({messageError: "The id conversation is invalid!"})
    
    // Getting _id Object the typeconversational for validation
    const type = await TypeConversation.findOne({type_identify: "chat_personal"})
    if(conversationObject.typeConvesation.equals(type._id)) return res.status(400).json({messageError: "Error, The first change configutaions this chat, please:)"})

    // Data updating in the body (addPart) ==> username
    const {addPart} = req.body

    const newParticipant = await findOne({username: addPart}, {password:0, permissions:0, privacy_settings:0, roles:0})
    if(newParticipant.length==0) return res.status(404).json({messageError: "The new participant not found :("})

    const conUpdate = conversationObject.participants.push(newParticipant._id)
    console.log(conUpdate)

  } catch (error) {
    console.log("The server has been an error")
  }
}

export default {
  getsConversationsAll,
  getConversationsById,
  createConversation,
  addParticipant,
  updateConversationById
};
