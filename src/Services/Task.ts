import { db } from "../utils/db"

import HistoryService from "../Services/History"
import CommentService from "../Services/Comment"
import SpentTimeService from "../Services/SpentTime"

import Task from "../Models/Task"
import History from "../Models/History"
import Comment from "../Models/Comment"
import SpentTime from "../Models/SpentTime"

class TaskService {
  async create(title: string, description: string, authorId: string, rowId: string, columnId: string, deskId: string, taskTypeId: string, initialAssessment = 0, performerId = null as string, tags = [] as string[], files = [] as string[]): Promise<Task> {
    return await db.task.create({
      data: { 
        title, description, authorId, rowId, columnId, deskId, taskTypeId, initialAssessment: Number(initialAssessment), performerId,
        tags: { connect: tags.map(tag => { return { id: tag } }) },
        files: { connect: files.map(file => { return { id: file } }) }
      }
    })
  }

  async update(id: string, updaterId: string) {
    await db.task.update({
      where: { id },
      data: { updaterId, updatedAt: new Date(Date.now()),}
    })
  }

  async updateTitle(id: string, title: string): Promise<void> {
    await db.task.update({
      where: { id },
      data: { title }
    })
  }

  async updateDescription(id: string, description: string): Promise<void> {
    await db.task.update({
      where: { id },
      data: { description }
    })
  }

  async updateFiles(id: string, files = [] as string[]): Promise<void> {
    await db.task.update({
      where: { id },
      data: { files: { set: files.map(file => { return { id: file } }) }  }
    })
  }

  async updateTags(id: string, tags = [] as string[]): Promise<void> {
    await db.task.update({
      where: { id },
      data: { tags: { set: tags.map(tag => { return { id: tag } }) }  }
    })
  }

  async updateInitialAssessment(id: string, initialAssessment: number): Promise<void> {
    await db.task.update({
      where: { id },
      data: { initialAssessment: Number(initialAssessment) }
    })
  }

  async updatePerformerId(id: string, performerId: string): Promise<void> {
    await db.task.update({
      where: { id },
      data: { performerId }
    })
  }

  async updateRowId(id: string, rowId: string): Promise<void> {
    await db.task.update({
      where: { id },
      data: { rowId }
    })
  }

  async updateColumnId(id: string, columnId: string): Promise<void> {
    await db.task.update({
      where: { id },
      data: { columnId }
    })
  }

  async updateTaskTypeId(id: string, taskTypeId: string): Promise<void> {
    await db.task.update({
      where: { id },
      data: { taskTypeId }
    })
  }

  async updateDeskId(id: string, deskId: string): Promise<void> {
    await db.task.update({
      where: { id },
      data: { deskId }
    })
  }

  async getTaskUpdatable(id: string) {
    const task = await db.task.findFirst({
      where: { id },
      select: {
        title: true,
        description: true,
        initialAssessment: true,
        performerId: true,
        rowId: true,
        columnId: true,
        deskId: true,
        taskTypeId: true,
        tags: { select: { id: true } },
        files: { select: { id: true } },
      }
    })

    const { tags, files, ...data } = task
    return {
      ...data,
      tags: tags.map(tag => tag.id),
      files: files.map(file => file.id),
    }
  }

  async getTask(id: string) {
    const task = await db.task.findFirst({
      where: { id },
      include: {
        tags: { select: { id: true } },
        files: { select: { path: true } }
      }
    })

    const { tags, files, ...data } = task

    return {
      ...data,
      tags: tags.map(tag => tag.id),
      files: files.map(file => file.path)
    }
  }

  async getTaskWall(id: string) {
    const [histories, comments, spentTime] = await Promise.all([
      HistoryService.getAllHistories(id),
      CommentService.getAllComments(id),
      SpentTimeService.getAllSpentTimes(id)
    ])

    const wall = [...histories, ...comments, ...spentTime] as Array<History | Comment | SpentTime>
    return wall.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  async delete(id: string): Promise<void> {
    await db.task.delete({ where: { id }})
  }
}

export default new TaskService()