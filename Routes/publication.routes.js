import { Router } from "express";
import postCtrl from "../Controllers/PublicationController.js"

const router = Router()

router.post("/creating", postCtrl.createPost)

export default router;