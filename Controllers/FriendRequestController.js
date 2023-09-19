import FriendRequest from "../Models/FriendRequest.js";
import User from "../Models/User.js";
import moment from "moment";
var time = moment().format('MMMM Do YYYY, h:mm:ss a');

const createFriendRequest = async(req, res) => {
    try {
        const {userSenderId, userDestination} = req.body
        // Validation if The user Sender exists
        const existUserSender = await User.findById(userSenderId).catch((error) => {
            console.log(error)
            return res.status(400).json({success: false, messageError: "User not found"})
        })
        if(!existUserSender || existUserSender==null) return res.status(400).json({success: false, messageError: "UserSender not found"})

        // Validation if the user Destination exists
        const existUserDestination = await User.findOne({username: userDestination}).catch((error) => {
            console.log(error)
            return res.status(400).json({success: false, messageError: "User not found"})
        })
        console.log(existUserDestination)
        if(!existUserDestination || existUserDestination==null) return res.status(400).json({success: false, messageError: "UserDestination not found"})

        const friendRequestExists = await FriendRequest.findOne({
            $or: [
                { userSender: existUserSender._id, userDestination: existUserDestination._id },
                { userSender: existUserDestination._id, userDestination: existUserSender._id }
            ]
        });

        if (friendRequestExists) return res.status(400).json({success: false, messageError: "The solicitude already exist"})

        // Creating FriendRequest
        const friendRequestCreate = await new FriendRequest({
            userDestination: existUserDestination._id,
            userSender: existUserSender._id,
            response: "Pending",
            timestamps: time,
        }).save()

        // Vlaidation if the friendRequest has been sended
        if(!friendRequestCreate) return res.status(400).json({success: false, messageError: "The friendship request hasn´t been sended 😖 "})
        console.log(friendRequestCreate)

        // Add the friendRequest at User Sender
        const userSenderUpdate = await User.updateOne({_id: userSenderId}, {$push: { friendRequest_sender: friendRequestCreate._id}}).catch((err) => {
            console.log("An error has ocurred in add the friendrequest at userSender:(")
            return res.status(404).json({success: false, messageError: "An error has ocurred :( "})
        })
        console.log("The friendRequest at userSender has been added")

        // Add the friendRequest at User Destination
        const userDestinationUpdate = await User.updateOne({_id: existUserDestination._id}, {$push: { friendRequest_me: friendRequestCreate._id}}).catch((err) => {
            console.log("An error has ocurred in add the friendrequest at userSender:(", err)
            return res.status(404).json({success: false, messageError: "An error has ocurred :( "})
        })
        console.log("The friendRequest at userDestination has been added")

        return res.status(200).json({success: true, data: friendRequestCreate})

    } catch (error) {
        console.log("An error has ocurred in the server 😖", error)
    }
}

const acceptFriendRequest = async(req, res) => {
    try {
        // Id (Friend Request) & Id (User Destination)
        const {id, idUserDestination} = req.body;
        // Validation by User Sender. if user exists by (id)
        const user = await User.findById(idUserDestination).catch((error) => {
            console.log(error)
            return res.status(404).json({success: false, messageError: "The user not found"})
        })

        if((!user) || user == null) return res.status(404).json({success: false, messageError: "The user not found"})

        // Validation Friend Request exits by id request.
        const requestFriend = await FriendRequest.findById(id).catch((error) => {
            console.log(error)
            return res.status(404).json({success: false, messageError: "The request not found"})
        })

        if((!requestFriend) || requestFriend== null) return res.status(404).json({success: false, messageError: "The request not found"})
        if(!(requestFriend.userDestination.equals(user._id))) return res.status(401).json({success: false, messageError: "Unathorized!"})
        console.log(requestFriend)

        // change the status of the solicitude friend (Pending --> Accepted) And remove the requestFriend from your properties
        const requestFriendUpdated = await FriendRequest.updateOne({_id: id}, {$set: {response: "Accepted"}} ).catch((err) => {
            console.log(err)
            return res.status(400).json({success: false, messageError: "It hasn't been posible to complete the update:("})
        })
        if((!requestFriendUpdated) || requestFriend==null) return res.status(400).json({success: false, messageError: "It hasn't been posible to complete the update:("})
        console.log("Part 1°: \tThe status of the FriendRequest has been changed from Pending to Accepted!")

        // Add in the array of the properties friends of both users (UserSender - UserDestination)
        const userDestinationUpdated = await User.updateOne({_id: requestFriend.userDestination}, {$push: {friends: requestFriend.userSender}, $pull: {friendRequest_me: requestFriend._id}}).catch((err) => {
            console.log(err)
            return res.status(400).json({success: false, messageError: "It hasn't been posible to complete the update:("})
        })

        const userSenderUpdated = await User.updateOne({_id: requestFriend.userSender}, {$push: {friends: requestFriend.userDestination}, $pull: {friendRequest_sender: requestFriend._id}}).catch((err) => {
            console.log(err)
            return res.status(400).json({success: false, messageError: "It hasn't been posible to complete the update:("})
        })

    } catch (error) {
        console.log("An error has ocurred in the server :(")
    }
}

export default {
    createFriendRequest,
    acceptFriendRequest
}