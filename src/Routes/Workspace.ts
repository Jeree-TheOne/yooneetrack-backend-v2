import { Router } from "express"
import WorkspaceController from "../Controllers/Workspace"

const router = Router();

router.get('/:id', WorkspaceController.selectOne)
router.get('/', WorkspaceController.selectAll)
router.post('/', WorkspaceController.create)
router.put('/:id', WorkspaceController.update)
router.delete('/:id', WorkspaceController.delete)

export default router