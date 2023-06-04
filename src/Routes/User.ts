import { Router } from "express"
import UserController from "../Controllers/User"

const router = Router();

router.put('/upload-avatar', UserController.uploadAvatar)
router.put('/remove-avatar', UserController.removeAvatar)
router.put('/change-name', UserController.changeName)
router.put('/change-login', UserController.changeLogin)
router.put('/change-password', UserController.changePassword)
router.put('/block', UserController.blockUser)
router.put('/premium', UserController.premiumUser)

export default router