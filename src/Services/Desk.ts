import { db } from "../utils/db"

import Desk from "../Models/Desk"
import ApiError from "../Exceptions/ApiError"

class DeskService {
  async create(name: string, workspaceId: string, isCurrent = false): Promise<void> {
    const { id } = await db.desk.create({ data: { name,workspaceId } })
    if (isCurrent) await this.setCurrent(id, workspaceId)
  }

  async delete(id: string): Promise<void> {
    const { workspaceId } = await db.desk.findFirst({ where: { id }})
    const desks = await db.desk.findMany({ where: { workspaceId }})
    if (!desks.length) throw ApiError.BadRequest('Нельзя удалить единственную доску')

    const { isCurrent } = await db.desk.delete({ where: { id }})
    if (isCurrent) {
      await this.setCurrent(desks[0].id)
    }
  }

  async update(id: string, name: string): Promise<void> {
    await db.desk.update({ where: { id }, data: { name }})
  }

  async setCurrent(id: string, workspaceId: string = null): Promise<void> {
    if (workspaceId) await db.desk.updateMany({ 
      where: { AND: [ { workspaceId }, { isCurrent: true } ] }, 
      data: { isCurrent: false } 
    })
    await db.desk.update({ where: { id }, data: { isCurrent: true } })
  }

  async selectOne(id: string): Promise<any> {
    const desk = await db.desk.findFirst({ 
      where: { id },
      include: {
        tasks: {
          include: {
            tags: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    const { tasks, ...data } = desk

    return { 
      ...data,
      tasks: tasks.map(task => {
        const { tags, ...data } = task
        return {
          ...data,
          tags: tags.map(tag => tag.id)
        }
      })
    }
  }
}

export default new DeskService()