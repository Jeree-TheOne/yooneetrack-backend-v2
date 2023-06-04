import { db } from "../utils/db"

import PersonalTask from "../Models/PersonalTask"

class PersonalTaskService {
  async create(userId: string, title: string, description: string, isImportant = false, isUrgent = false, deadline = new Date(Date.now() + 12096e5), files = [] as string[]): Promise<PersonalTask> {
    return await db.personalTask.create({ 
      data: { 
        title, description, isImportant, isUrgent, deadline,
        files: { connect: files.map(file => { return { id: file } }) },
        user: { connect: { id: userId} }
      } 
    })
  }

  async update(id: string, title: string, description: string, isImportant: boolean, isUrgent: boolean, isDone: boolean, deadline: Date, files = [] as string[]): Promise<void> {
    await db.personalTask.update({ 
      where: { id }, 
      data: { 
        title, description, isImportant, isUrgent, isDone, deadline,
        files: { connect: files.map(file => { return { id: file } }) }
      }, 
    })
  }

  async select(userId: string): Promise<PersonalTask[]> {
    const tasks =  await db.personalTask.findMany({ where: { userId }, include: { files: true }, orderBy: { createdAt: 'asc'}})
    return tasks.map(task => {
      const { files, ...data } = task
      return {
        ...data,
        files: files.map(file => file.path)
      }
    })
  }

  async delete(id: string): Promise<void> {
    await db.personalTask.delete({ where: { id }})
  }
}

export default new PersonalTaskService()