import { Router } from "express";
import userCtrl from "../Controllers/UserController.js"
import {verifyToken} from '../Middlewares/verifyToken.js'
import {validateSchema} from '../Middlewares/validateRequest.js'
import {loginSchema, registerSchema} from '../Schema/authSchema.js'

const router  = Router()

// Routes
router.post("/sign-in", validateSchema(loginSchema), userCtrl.signIn)
router.post("/sign-up", validateSchema(registerSchema), userCtrl.signUp)
// router.post("/sign-in", userCtrl.signIn)
// router.post("/sign-up", userCtrl.signUp)

router.post("/sign-out", userCtrl.signOut)
router.get("/getsUserAlls", userCtrl.getsUsers)
router.post("/getUserById/:id", verifyToken, userCtrl.getuserById)
router.post("/getsEstadistics-User", userCtrl.UserByEstadistics)
router.post("/providerGitHubExist", userCtrl.ProviderGitHubExist)

export default router;