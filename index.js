// Imports the modules
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import moment from "moment";
import cookieParser from "cookie-parser";
import routeUser from "./Routes/user.routes.js"
import "./Database.js"
import helmet from 'helmet'
import morgan from "morgan";
import {createRoles } from './Libs/InitialSetup.js'
// Declaration of the variables
const app = express()
dotenv.config()
var time = moment().format('MMMM Do YYYY, h:mm:ss a');

//App uses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true}))
app.use(express.json())
app.use(cookieParser())
app.use('/User', routeUser)
// app.use(helmet());
app.use(morgan('dev'));
createRoles()


// Server running
app.listen(process.env.PORT_SERVER || 8089, async()=>{
    console.log(`Server in port ${process.env.PORT_SERVER}`)
})

app.use("/", (req, res)=>{
    res.send(`Hey Dev!, the server is running ${time}`)
})