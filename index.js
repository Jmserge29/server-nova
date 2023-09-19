// Imports the modules
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import moment from "moment";
import cookieParser from "cookie-parser";
import routeUser from "./Routes/user.routes.js"
import routerConversations from "./Routes/conversation.routes.js";
import routerSolicitude from './Routes/solicitude.routes.js'
import routerMessage from './Routes/message.routes.js'
import routerFriendRequest from "./Routes/friendrequest.routes.js";
import "./Database.js"
import helmet from 'helmet'
import morgan from "morgan";
import {createRoles, createTypesConversations, createUsers, createMessageWelcome, createInitialConversation } from './Libs/InitialSetup.js'
// import { removeSetup } from "./Libs/RemoveSetup.js";
// Declaration of the variables
const app = express()
dotenv.config()
var time = moment().format('MMMM Do YYYY, h:mm:ss a');

//App uses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true}))
app.use('/User', routeUser)
app.use(cookieParser())
app.use('/Message', routerMessage)
app.use('/Solicitude', routerSolicitude)
app.use('/Conversation', routerConversations)
app.use('/requestFriend', routerFriendRequest)
// app.use("/Constructor", removeSetup)
// app.use(helmet());
app.use(morgan('dev'));

// Server running
app.listen(process.env.PORT_SERVER || 8089, async()=>{
    console.log(`Server in port ${process.env.PORT_SERVER}`)
})

createRoles()
createTypesConversations()
createUsers()
createMessageWelcome()
createInitialConversation()


app.use("/", (req, res)=>{
    res.send(`Hey Dev!, the server is running ${time}`)
})