import { Router } from "express"
import DeskController from "../Controllers/Desk"

const router = Router();

router.get('/:id', DeskController.selectOne)
router.post('/', DeskController.create)
router.patch('/:id', DeskController.setCurrent)
router.put('/:id', DeskController.update)
router.delete('/:id', DeskController.delete)

export default router