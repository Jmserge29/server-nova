import Solicitude from "../Models/Solicitude.js";
import User from "../Models/User.js"
import Conversation from '../Models/Conversation.js'

// CHECK
const createSolicitude = async (req, res) => {
  try {
    const { sender_id, username_destination, conversation_id } = req.body;

    const solicitudeExist = await Solicitude.findOne({
      "sender_id.id": sender_id,
      "username_destination": username_destination,
      "conversation_id": conversation_id,
    });

    if(solicitudeExist) return res.status(409).json({messagError: `The solicitude already exists ${username_destination}`})

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

    // Add solicitudes_participants in the conversation
    conversation.solicitudes_participants.push(solicitudeCreate._id)
    const conversationUpdated = await Conversation.updateOne({_id: conversation_id}, { $set: { solicitudes_participants: conversation.solicitudes_participants } }).catch((error) => {
      console.log(error)
      return res.status(400).json({messagError: "The conversation hasn't been updated"})
    })
    if(conversationUpdated.modifiedCount == 0) return res.status(400).json({messagError: "The conversation hasn't been updated"})

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

// CHECK
const createManySolicitudes = async(req, res )=> {
  try {
    const {id} = req.params
    const {participant, sender_id} = req.body

    // Confirmation sender_id valid
    const userSender = await User.findById(sender_id).catch((error) => {
      console.log(error)
      return res.status(404).json({messageError: "Invalid credentials"})
    })

    if(!userSender) return res.status(400).json({messagError: "Invalid Credentials!"})

    //Validation aditional of the conversation exist
    const conversation = await Conversation.findById(id).catch((error) => {
      console.log(error)
      return res.status(400).json({messagError: "The id conversation is invalid"})
    })
    if(!conversation) return res.status(400).json({messagError:"The conversaion hasn't been found"})

    // Authorization
    if(!(conversation.creater_conversation === userSender.username)) return res.status(400).json({messagError: "Unauthorized!"})
    var solicitudesData = []
    var usersValids = []
    var usersInvalid = []
    var usersExist = []

    await Promise.all(participant.map(async(data, i)=> {
      // Validation if the user exist
      var userValid = await User.findOne({username: data}).catch((error) => {
          console.log(error)
          usersInvalid.push(data)
        })
      if(!userValid) {
        console.log("Invalid : ", data)
        usersInvalid.push(data)
        return
      }

      // Validation if the solicitude already exist
      var solicitudeExist = await Solicitude.findOne({
        "sender_id.id": sender_id,
        "username_destination": data,
        "conversation_id": id,
      });
      if(solicitudeExist){
        usersExist.push(data)
        return
      }

      usersValids.push(data)
      console.log(`The user (${i}): ${data}`)
      const solicitudeCreate = await new Solicitude(
        {
            sender_id: {
                username: userSender.username,
                id: sender_id
            },
            username_destination: data,
            conversation_id: id,
            response: "Pending"
        }
      ).save()

      solicitudesData.push(solicitudeCreate)
      
      // Add solicitude_sender of the User sender
      await userSender.solicitude_sender.push(solicitudeCreate._id)
      const userSenderUpdated = await User.updateOne({_id: sender_id}, { $set: { solicitude_sender: userSender.solicitude_sender } }).catch((error) => {
        console.log(error)
        return res.status(400).json({messagError: "The user hasn't been updated"})
      })
      if(userSenderUpdated.modifiedCount == 0) return res.status(400).json({messagError: "The user hasn't been updated"})
      
      // console.log("The User Solicitudes senders has been updated!\n")

      // Add solicitude_me of the user destination
      userValid.solicitude_me.push(solicitudeCreate._id)
      const userValidUpdated = await User.updateOne({_id: userValid._id}, { $set: { solicitude_me: userValid.solicitude_me }})

      if(userValidUpdated.modifiedCount == 0) return res.status(400).json({messagError: "The user hasn't been updated"})
      console.log("Usuarios Validos", usersValids)
    }))
    const newSolicitudes = solicitudesData.map((data)=>data._id)
    console.log(newSolicitudes)
    // Add solicitudes_participants in the conversation
    const conversationUpdated = await Conversation.updateOne({_id: id}, { $set: { solicitudes_participants: newSolicitudes } }).catch((error) => {
      console.log(error)
      return res.status(400).json({messagError: "The conversation hasn't been updated"})
    })
    if(conversationUpdated.modifiedCount == 0) return res.status(400).json({messagError: "The conversation hasn't been updated"})

    res.status(200).json(
      {
      success: true, 
      data: 
        {
          usersInvalid: usersInvalid,
          usersExist: usersExist,
          solicitudesSenders: usersValids,
          data: solicitudesData  
        }
      })


  } catch (error) {
    console.log("An error has been ocurred in the server: ", error)
  }
}

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

// CHECK
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

// CHECK
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

// CHECK
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

// CHECK
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

// CHECK
const deleteSolicitudeById = async(req, res) => {
  try {
    const {id} = req.params
    const solicitude = await Solicitude.findById(id).catch((error) => {
      console.log(error)
      return res.status(400).json({messagError: "The Solicitude not found"})
    })
    if(!solicitude) return res.status(400).json({messagError: "The Solicitude not found"})

    const solicitudeDeleted = await Solicitude.deleteOne({_id: id})
    if(solicitudeDeleted.deletedCount != 1) return res.status(402).json({messagError: "An error has ocurred"})
    return res.status(200).json({success: true, data: `The Solciitude  [ (id): ${id} ] has been deleted!`})
  } catch (error) {
    console.log("The server has been an error :(")
  }
}

// CHECK
const deleteManySolicitudes = async(req, res) => {
  try {
    const {id} = req.params
    const conversation = await Conversation.findById(id)
    if(!conversation) return res.status(404).json({success: false, messagError: "The conversation wasn't found"})

    const {solicitudes} = req.body
    var solicitudesDeleted = []
    var solicitudesError = []
    var solicitudesNotFound=[]

    await Promise.all(solicitudes.map(async(data, i) => {
      const solicitude = await Solicitude.findById(data).catch((error) => {
        solicitudesNotFound.push(data)
        return
      })
      if(!solicitude) {
        solicitudesNotFound.push(data)
        return
      }

      // Delete Solicitude in the perfil user Destination
      const userDestination = await User.findOne({username: solicitude.username_destination}).catch((error) => {
        solicitudesError.push(data)
        return
      })

      if(!userDestination) {
        solicitudesError.push(data)
        return
      }

      if(!(userDestination.solicitude_me.includes(data))){
        solicitudesError.push(data)
        return
      }

      const index = userDestination.solicitude_me.indexOf(data);
      if (!(index !== -1)) {
        solicitudesError.push(data)
        return
      }

      userDestination.solicitude_me.splice(index, 1);
      const updateSolicitudes = await User.updateOne({_id: userDestination._id}, {$set: {solicitude_me: userDestination.solicitude_me}})
      if(updateSolicitudes.modifiedCount != 1){
        solicitudesError.push(data)
        return
      }

      const solicitudeDeleted = await Solicitude.deleteOne({_id: data}).catch((error) => {
        console.log(error)
      })
      if(solicitudeDeleted.deletedCount != 1){
        solicitudesError.push(data)
        return
      }
      solicitudesDeleted.push({name: solicitude._id ,status: `delete`})
      return
    }))
    req.body.solicitudesNotFound = solicitudesNotFound
    req.body.solicitudesError = solicitudesError
    req.body.solicitudesDeleted = solicitudesDeleted

  } catch (error) {
    console.log("An error has ocurred in the server :(")
  }
 }

export default {
  createSolicitude,
  acceptSolicitude,
  getsSolicitudesAll,
  getSolicitudeById,
  getSolicitudesBySender_Id,
  getSolicitudesByDestination_Username,
  createManySolicitudes,
  deleteSolicitudeById,
  deleteManySolicitudes
}