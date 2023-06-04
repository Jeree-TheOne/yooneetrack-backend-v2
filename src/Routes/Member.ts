import { Router } from "express"
import MemberController from "../Controllers/Member"

const router = Router();

router.post('/', MemberController.add)
router.put('/:id', MemberController.update)
router.put('/block/:id', MemberController.block)
router.get('/activate/:id', MemberController.activate)

export default router