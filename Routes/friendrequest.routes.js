import { Router } from "express";
import friendRequestCtrl from "../Controllers/FriendRequestController.js";
const router = Router()

router.post("/createFriendRequest", friendRequestCtrl.createFriendRequest)
router.post("/acceptFriendRequest", friendRequestCtrl.acceptFriendRequest)

export default router;