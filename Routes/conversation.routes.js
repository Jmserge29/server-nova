import { Router } from "express";
import ConversationCtrl from "../Controllers/ConversationController.js"


const router = Router()

// Routes
router.post("/createConvesartion", ConversationCtrl.createConversation)
router.get("/getsAllConversations", ConversationCtrl.getsConversationsAll)
router.get("/getConversationsById/:id", ConversationCtrl.getConversationsById)
router.put("/updateConversationById/:id", ConversationCtrl.updateConversationById)
router.delete("/deleteConversationById/:id", ConversationCtrl.deleteConversationById)

router.put("/addParticipant/:id", ConversationCtrl.addParticipant)
export default router;