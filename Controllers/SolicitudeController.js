import Solicitude from "../Models/Solicitude.js";
import User from "../Models/User.js"
import Conversation from '../Models/Conversation.js'

const createSolicitude = async (req, res) => {
  try {
    const { sender_id, username_destination, conversation_id } = req.body;

    const solicitudeExist = await Solicitude.findOne({
      "sender_id.id": sender_id,
      "username_destination": username_destination,
      "conversation_id": conversation_id,
    });

    if(solicitudeExist) return res.status(409).json({messagError: "The solicitude already exists"})

    // Confirmation sender_id valid
    const userValid = await User.findById(sender_id).catch((error) => {
      console.log(error)
      return res.status(404).json({messageError: "Invalid credentials"})
    })
    if(userValid === null) return res.status(404).json({messageError: "Invalid credentials"})
    else if(userValid.length == 0) return res.status(404).json({messageError: "Invalid credentials"})
    
    // Search user ==> (username_destination)
    const userAdmitid = await User.findOne({username: username_destination})
    if(userAdmitid == null) return res.status(404).json({messageError: "Invalid credentials"})
    else if(userAdmitid.length==0) return res.status(404).json({messageError: "User not found"})
    // Search conversation ==> (conversation_id)
    const conversation = await Conversation.findById(conversation_id)
    if(conversation == null) return res.status(404).json({messageError: "Invalid credentials"})
    else if(conversation.length==0) return res.status(404).json({messageError: "The conversation provided not found"})
    
    const solicitudeCreate = await new Solicitude(
        {
            sender_id: {
                username: userValid.username,
                id: sender_id
            },
            username_destination: username_destination,
            conversation_id: conversation_id,
            response: "Pending"
        }
    ).save()

    console.log(solicitudeCreate)

    // Add solicitude_sender of the User sender
    userValid.solicitude_sender.push(solicitudeCreate._id)
    const userSenderUpdated = await User.updateOne({_id: sender_id}, { $set: { solicitude_sender: userValid.solicitude_sender } }).catch((error) => {
      console.log(error)
      return res.status(400).json({messagError: "The user hasn't been updated"})
    })
    if(userSenderUpdated.modifiedCount == 0) return res.status(400).json({messagError: "The user hasn't been updated"})
    
    console.log("The User Solicitudes senders has been updated!\n")

    // Add solicitude_me of the user destination
    userAdmitid.solicitude_me.push(solicitudeCreate._id)
    const userAdmitidUpdated = await User.updateOne({_id: userAdmitid._id}, { $set: { solicitude_me: userAdmitid.solicitude_me }})

    if(userAdmitidUpdated.modifiedCount == 0) return res.status(400).json({messagError: "The user hasn't been updated"})
    
    console.log("The UserAdmitid Solicitudes me has been updated!")

    console.log("The Solicitude has been created success!")
    return res.status(200).json({success: true, data: solicitudeCreate})

  } catch (error) {
    console.log("The server has been an error :(");
  }
};

// Accept Solicitude by id in the params.id (Update response)
const acceptSolicitude = async(req, res) => {
    try {
        // id is conversation_id
        const {id} = req.params.id
        
        const conversation = await Conversation.findById(id)
        if(conversation.length==0) return res.status(404).json({messageError: "The conversation provided not found"})
        
        // user_id for validation of check Solicitude 
        const {user_id} = req.body
        const user = await User.findById(user_id)
        if(user.length==0) return res.status(404).json({messageError: "Invalid Credentials"})

        // Validation correct user by user desatination in the Solicitude
        if(!conversation.username_destination.equals(user.username)) return res.status(400).json({messageError: "Invalid Credentials u"})
        // Change the status response in the solicitude conversation
        console.log(conversation)
        conversation.response = true
        
        const convesationUpdated = await Conversation.updateOne({_id: id}, {conversation})
        console.log("The Solicitude has been accepted!")



    } catch (error) {
        console.log("The server has been an error :(")
    }
}

const getsSolicitudesAll = async(req, res) => {
  try {
    const solicitudes = await Solicitude.find({}).catch(error => {
      console.log(error)
      return res.status(400).json({ success: false, error: error })
  })
  
  if (!solicitudes.length) {
      return res.status(404).json({
          success: false,
          messageError: `solicitudes not found`
      })
  }
  return res.status(200).json({ success: true, data: solicitudes })
  } catch (error) {
    console.log("The sever has been an error :(")
  }
}

const getSolicitudeById = async(req, res)=> {
  try {
    const {id} = req.params.id
    const solicitude = await Solicitude.findById(id).catch(error => {
      console.log(error)
      return res.status(400).json({ success: false, error: error })
  })

  if(!solicitude.length) return res.status(404).json({success: false, messagError: "The solicitude not found"})

  return res.status(200).json({success: true, data: solicitude})
  } catch (error) {
    console.log("The server has been an error :(")
  }
}

const getSolicitudesBySender_Id = async(req, res) => {
  try {
    const {id} = req.params.id

    const solicitudes = await Solicitude.find({sender_id: id}).catch((error) => {
      return res.status(400).json({success: false, error: error})
    })

    if(!solicitudes.length) return res.status(404).json({success: false, messageError: "The Solicitudes not found"})

    res.status(200).json({success: true, data: solicitudes})
  } catch (error) {
    console.log("The server has been an error :(")
  }
}

const getSolicitudesByDestination_Username = async(req, res) => {
  try {
    const {username} = req.params.username

    const solicitudes = await Solicitude.find({username_destination: username}).catch((error) => {
      return res.status(400).json({success: false, error: error})
    })

    if(!solicitudes.length) return res.status(404).json({success: false, messageError: "The Solicitudes not found"})

    res.status(200).json({success: true, data: solicitudes})
  } catch (error) {
    console.log("The server has been an error :(")
  }
}


export default {
  createSolicitude,
  acceptSolicitude,
  getsSolicitudesAll,
  getSolicitudeById,
  getSolicitudesBySender_Id,
  getSolicitudesByDestination_Username,
}