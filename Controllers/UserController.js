import User from "../Models/User.js"
import Role from "../Models/Role.js"
import jwt from "jsonwebtoken"
import emailValidator from 'email-validator'
import moment from "moment"
var time = moment().format('MMMM Do YYYY, h:mm:ss a');

// Registrarion user por SignUp Page
const signUp = async(req, res)=>{
    try {   
        
        const headers_info = ["username", "email", "password", "full_name"]
        // Destroying information the user
        const {username, email, password, full_name, roles} = req.body;
        const data_inputs = [username, email, password, full_name]
        // Validation if the alls the inputs are full
        for(var i=0; i<4;i++){
            if(!data_inputs[i]){
                return res.status(400).json({
                    messageError: `An error has ocurred in input the data (${headers_info[i]})`
                })
            }
        }

        if(!emailValidator.validate(email)) return res.status(403).json({messageError: "The email is invalid!"})

        // Validation Error duplicate users with same email
        const emailFound = await User.find({email: email},{password:0, roles:0, privacy_settings:0, preferences:0, permissions:0, birthdate:0, full_name:0, phone_number:0, username:0})
        if(emailFound.length>0){
            return res.status(403).json({messageError: "The email entered has been registrated! Please, input an other email :)"})
        }

        // Validation Error duplicate users with same email
        const usernameFound = await User.find({username: username},{password:0, roles:0, privacy_settings:0, preferences:0, permissions:0, birthdate:0, full_name:0, phone_number:0, email:0})
        if(usernameFound.length>0){
            return res.status(403).json({messageError: "The username entered has been registrated! Please, input an other username :)"})
        }
        

        // The proccess of data transformations for save in database
        const passwordEncrypted = await User.encryptPassword(password)

        // Creating user in the model
        const userCreate = new User(
            {
                username,
                email,
                password: passwordEncrypted,
                full_name,
                birthdate: "null",
                phone_number: 0,
                preferences: {
                    notification_settings: {
                        email: true,
                        sms: false,
                        push: true
                    },
                    language: "",
                    timezone: ""
                },
                privacy_settings: {
                    profile_visibility: "public",
                    contact_info_visibility: "friends_only"
                },
                activity_history: {
                    last_login: time,
                    last_message: {
                        id: "",
                        content: "",
                        timestamp: "",
                        channel_id: ""
                    },
                    total_messages_sent: 0,
                    total_files_uploaded: 0,
                    total_friends: 0
                },
                usage_statistics: {
                    total_time_on_platform: "0h",
                    followers_count: 0,
                    following_count: 0
                },
                permissions: {
                    can_post_messages: true,
                    can_create_channels: false,
                    can_invite_users: true
                    }
            }
        )
        // console.log(userCreate)

        // Verify roles and store in userCreate
        if (roles) {
            const rolesFound = await Role.find({ role: { $in: roles } });
            userCreate.roles = rolesFound.map((role) => role._id)
        }
        else {
            const role = await Role.findOne({ role: 'user' })
            userCreate.roles = [role._id]
        }

        // saving user created
        const userCreated = await userCreate.save()

        // Genereting token by JWT 
        const token = jwt.sign({ id: userCreated._id }, process.env.SECRET_KEY_TOKEN)
        // Error prevention user not assigned
        if (!userCreated) {
            return res.status(400).json({
                success: false,
                message: 'The user has not been created :('
            })
        }
        return res.status(200).json({
            data: userCreated,
            token: token
        });

    } catch (error) {
        console.log(`An error has ocurred in the server :(\nThe error is ${error}`)
    }
}

// Login the User for SignIn
const signIn = async(req,res)=>{
    try {
        const {email, password} = req.body
        if(!email) return res.status(400).json({message: 'No email provided'})
        if(!password) return res.status(400).json({message: 'No password provided'})
        if(!emailValidator.validate(email)) return res.status(403).json({messageError: "The email is invalid!"})
        const userFound = await User.findOne({email: email}, {roles:0,roles:0, privacy_settings:0, preferences:0, permissions:0, birthdate:0, full_name:0, phone_number:0, username:0})
        if(!userFound) return res.status(404).json({auth: false, message: 'the user not found'})
        // Descrypted password and validation if this password is correct or not
        const passwordCompared = await User.comparePassword(password, userFound.password)
        if (!passwordCompared) {
            return res.status(404).json({
                auth: false,
                token: null,
                message: 'Invalided password'
            })
        }

        // Store _id the user in the token {_id: "Usuario2123321"}
        const token = jwt.sign({ id: userFound._id }, process.env.SECRET_KEY_TOKEN, {
            expiresIn: 60 * 60 * 24
        })
        console.log(time)
        const user = await User.findByIdAndUpdate(userFound._id, {activity_history: {last_login: time}})
        return res.status(200).json({auth: true, token: token, user: user})
    } catch (error) {
        res.status(404).json({
            message: 'advertence, an error has ocurred!'
        })
        
    }
}

// Exit session the user in the fuction SignOut
const signOut = async (req, res) => {
    try {
        res.send('Oh, signOut, i hope see soon:)')

    } catch (error) {
        res.status(404).json({
            message: 'advertence, an error has ocurred!'
        })
    }
}

// Getting alls the users by admins  
const getsUsers = async(req, res)=>{
    try {
        const user = await User.find({}).catch(error => {
            console.log(error)
            return res.status(400).json({ success: false, error: error })
        })
        
        if (!user.length) {
            return res.status(404).json({
                success: false,
                message: `users not found`
            })
        }
        return res.status(200).json({ success: true, data: user })
    } catch (error) {
        console.log(`An error has ocurred in the server :(\nThe erro is ${error}`)
    }
}

// Get user asking by id
const getuserById = async(req, res) =>{
    try {
        const {username} = req.body
        if(!username){
            return res.status(401).json({message: 'The requests is bad'})
        }
        const userSearch = await User.find({username: username})
        if (!userSearch.length) {
            return res.status(404).json({
                success: false,
                message: `users not found`
            })
        }
        return res.status(200).json({userSearch})

    } catch (error) {
        console.log(`An error has ocurred in the server :(\nThe erro is ${error}`)
    }
}

// Estadistics or data the user for control the activity
const UserByEstadistics = ()=>{
    try {
        
    } catch (error) {
        console.log(`An error has ocurred in the server :(\nThe erro is ${error}`)
    }
}


export default {
    signIn,
    signUp,
    signOut,
    getsUsers,
    getuserById,
    UserByEstadistics,
}