import { Router } from 'express'
import UserRouter from './Routes/User'
import AuthRouter from './Routes/Auth'
import WorkspaceRouter from './Routes/Workspace'
import DeskRouter from './Routes/Desk'
import ColumnRouter from './Routes/Column'
import RowRouter from './Routes/Row'
import TagRouter from './Routes/Tag'
import MemberRouter from './Routes/Member'
import TaskTypeRouter from './Routes/TaskType'
import TaskRouter from './Routes/Task'
import PersonalTaskRouter from './Routes/PersonalTask'

import AuthMiddleware from './Middleware/Auth'

const router = Router()

router.use('/user', AuthMiddleware, UserRouter)
router.use('/auth', AuthRouter)
router.use('/workspace', AuthMiddleware, WorkspaceRouter)
router.use('/desk', AuthMiddleware, DeskRouter)
router.use('/column', AuthMiddleware, ColumnRouter)
router.use('/row', AuthMiddleware, RowRouter)
router.use('/tag', AuthMiddleware, TagRouter)
router.use('/member', AuthMiddleware, MemberRouter)
router.use('/task-type', AuthMiddleware, TaskTypeRouter)
router.use('/task', AuthMiddleware, TaskRouter)
router.use('/personal-task', AuthMiddleware, PersonalTaskRouter)

export default router