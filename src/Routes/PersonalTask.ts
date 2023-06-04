import { Router } from "express"
import PersonalTaskController from "../Controllers/PersonalTask"

const router = Router();

router.get('/', PersonalTaskController.selectAll)
router.post('/', PersonalTaskController.create)
router.put('/:id', PersonalTaskController.update)
router.delete('/:id', PersonalTaskController.delete)

export default router