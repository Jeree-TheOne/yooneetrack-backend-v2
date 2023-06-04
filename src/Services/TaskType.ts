import { db } from "../utils/db"

import TaskType from "../Models/TaskType"

class TaskTypeService {
  async create(name: string, workspaceId: string): Promise<TaskType> {
    return await db.taskType.create({ data: { name, workspaceId } })
  }

  async update(id: string, name: string): Promise<void> {
    await db.taskType.update({ where: { id } , data: { name } })
  }

  async delete(id: string): Promise<void> {
    await db.taskType.delete({ where: { id }})
  }
}

export default new TaskTypeService()