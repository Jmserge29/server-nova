import { Router } from "express";
import ConversationCtrl from "../Controllers/ConversationController.js"


const router = Router()

// Routes
router.post("/createConvesartion", ConversationCtrl.createConversation)
router.get("/getsAllConversations", ConversationCtrl.getsConversationsAll)
router.get("/getConversationsById/:id", ConversationCtrl.getConversationsById)
router.post("/addParticipant/:id", ConversationCtrl.addParticipant)

export default router;