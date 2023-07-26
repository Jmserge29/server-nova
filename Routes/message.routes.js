import { Router } from "express";
import messageCtrl from '../Controllers/MessageController.js'


const router = Router()

// Routes
router.post("/createMessage", messageCtrl.createMessage)
router.get("/getMessagesAlls", messageCtrl.getMessagesAll)
router.get("/getMessagesById/:id", messageCtrl.getMessageById)
router.put("/updateMessageById/:id", messageCtrl.updateMessageById)
router.delete("/deleteMessageById/:id", messageCtrl.deleteMessageById)


export default router; 