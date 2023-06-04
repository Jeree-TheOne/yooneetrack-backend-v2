import { Router } from "express"
import ColumnController from "../Controllers/Column"

const router = Router();

router.post('/', ColumnController.create)
router.put('/:id', ColumnController.update)
router.delete('/:id', ColumnController.delete)

export default router