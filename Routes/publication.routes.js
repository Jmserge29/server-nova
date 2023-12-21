import { Router } from "express";
import postCtrl from "../Controllers/PublicationController.js"

const router = Router()

router.post("/creating", postCtrl.createPost)
router.get("/getsPostByIdUser/:id", postCtrl.getsPostByIdUser)

export default router;