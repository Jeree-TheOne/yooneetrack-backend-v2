import { Router } from "express"
import TagController from "../Controllers/Tag"

const router = Router();

router.post('/', TagController.create)
router.put('/:id', TagController.update)
router.delete('/:id', TagController.delete)

export default router