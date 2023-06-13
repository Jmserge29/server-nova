import { Router } from "express";
import userCtrl from "../Controllers/UserController.js"
import {verifyToken} from '../Middlewares/verifyToken.js'

const router  = Router()

// Routes
router.post("/sign-in", userCtrl.signIn)
router.post("/sign-up", userCtrl.signUp)
router.post("/sign-out", userCtrl.signOut)
router.get("/getsUserAlls", userCtrl.getsUsers)
router.post("/getUserById:id", verifyToken, userCtrl.getuserById)
router.post("/getsEstadistics-User", userCtrl.UserByEstadistics)

export default router;