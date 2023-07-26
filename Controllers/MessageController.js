import Message from "../Models/Message.js";
import User from '../Models/User.js'
import moment from "moment"

var time = moment().format('MMMM Do YYYY, h:mm:ss a');

const createMessage = async(req, res) => {
    try {
        const {sender_id, content} = req.body
        // Validation if the senderId is correct
        const userSender = await User.findById(sender_id).catch((error) => {
            console.log(error)
            return res.status(404).json({messageError: "Error with the User ID Sender"})
        })
        if(!userSender) return res.status(404).json({messageError: "The user not found"})

        const messageEncrypted = await Message.encryptMessage(content)

        const messageCreate = await new Message(
            {
                sender_id,
                content: messageEncrypted,
                timestamp: time,
                reactions: []
            }
        ).save()
        
        res.status(200).json({success: true, data: messageCreate})

    } catch (error) {
        console.log("An error has been in the server :( ", error)
    }
}

const getMessagesAll = async(req, res) => {
    try {
        const messages = await Message.find({}).catch((error)=> {
            console.log(error)
            res.status(400).json({success: false, messageError: "Error in the find Messages"})
        })

        if(!messages) res.status(404).json({success: false, messageError:"The messages not found"})
        return res.status(200).json({success: true, data: messages})

    } catch (error) {
        console.log("An error has been in the server :(", error)
    }
}

const getMessageById = async(req, res) => {
    try {
        const {id} = req.params
        const message = await Message.findById(id).catch((error) => {
            console.log(error)
            res.status(400).json({success: false, messageError: "Error in the find Message with Id: ", id})
        })

        if(!message) res.status(404).json({success: false, messageError: "The Message not found"})
        return res.status(200).json({success: true, data: message})
    } catch (error) {
        console.log("An error has been in the server :(", error)
    }
}

const updateMessageById = async(req, res) => {
    try {
        const {id} = req.params
        const {content, sender_id} = req.body

        const user = await User.findById(sender_id).catch((error) => {
            console.log(error)
            return res.status(400).json({success: false, messageError: "Invalid credentials"})
        })

        if(!user) return res.status(404).json({success: false, messageError: "The user not found"})

        const message = await findById(id).catch((error) => {
            console.log(error)
            return res.status(400).json({success: false, messageError: "Error in the update message"})
        })

        if(!message) return res.status(404).json({success: false, messageError: "The Message not found"})
        if(!(message.sender_id.equals(sender_id))) return res.status(401).json({success: false, messageError: "Unathorized"})

        const messageEncrypted = await Message.encryptMessage(content)
        const messageUpdated = await Message.updateOne({_id: id}, { $set: {content: messageEncrypted}})
        if(messageUpdated.modifiedCount != 1) return res.status(400).json({success: false, messageError: "The message has not been updated"})

        return res.status(200).json({success: true, data: "The message has been updated! :)"})
    } catch (error) {
        console.log("An error has been in the server :(", error)
    }
}

const deleteMessageById = async(req, res)=> {
    try {
        const {id}= req.params
        const {sender_id} = req.body

        const user = await User.findById(sender_id).catch((error) => {
            console.log(error)
            return res.status(400).json({success: false, messageError: "Invalid credentials"})
        })

        if(!user) return res.status(404).json({success: false, messageError: "The user not found"})

        const message = await Message.findById(id).catch((error) => {
            console.log(error)
            return res.status(400).json({success: false, messageError: "Error in the delete Message"})
        })

        if(!(message.sender_id.equals(sender_id))) return res.status(401).json({success: false, messageError: "Unathorized"})

        const messageDeleted = await Message.deleteOne({_id: id})
        if(messageDeleted.deletedCount != 1) return res.status(400).json({success: false, messageError: "The message hasn't been deleted! :("})

        return res.status(200).json({success: true, data: "The message has been deleted!"})
    } catch (error) {
        console.log("An error has been in the server :(", error)
    }
}

const deleteManyMessages = async(req, res) => {
    try {
        const {messages} = req.body
        var errorDeletedMessage = []
        var messagesDeleteds = []
        await Promise.all(messages.map(async(data) => {
            const message = await Message.findById(data).catch((error)=> {
                console.log(error)
                errorDeletedMessage.push(data)
                return
            })
            if(!message){
                errorDeletedMessage.push(data)
                return
            }

            const messageDeleted = await Message.deleteOne({_id: data}).catch((error)=> {
                console.log(error)
                errorDeletedMessage.push(data)
                return
            })

            if(messageDeleted.deletedCount != 1) {
                errorDeletedMessage.push(data)
                return
            }

            messagesDeleteds.push(data)
        }))
        req.body.errorDeletedMessage = errorDeletedMessage
        req.body.messagesDeleteds = messagesDeleteds

    } catch (error) {
        console.log("An error has been in the server :(", error)
    }
}

export default {
    createMessage,
    getMessagesAll,
    getMessageById,
    updateMessageById,
    deleteMessageById,
    deleteManyMessages
}