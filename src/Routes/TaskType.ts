import { Router } from "express"
import TaskTypeController from "../Controllers/TaskType"

const router = Router();

router.post('/', TaskTypeController.create)
router.put('/:id', TaskTypeController.update)
router.delete('/:id', TaskTypeController.delete)

export default router