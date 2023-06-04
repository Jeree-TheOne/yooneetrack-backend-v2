import { Router } from "express"
import RowController from "../Controllers/Row"

const router = Router();

router.post('/', RowController.create)
router.put('/:id', RowController.update)
router.delete('/:id', RowController.delete)

export default router