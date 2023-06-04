import { Router } from "express"
import TaskController from "../Controllers/Task"

const router = Router();

router.get('/:id', TaskController.select)
router.get('/wall/:id', TaskController.wall)
router.post('/', TaskController.create)
router.post('/comment/:id', TaskController.addComment)
router.post('/spent-time/:id', TaskController.addSpentTime)
router.put('/:id', TaskController.update)
router.delete('/:id', TaskController.delete)

export default router