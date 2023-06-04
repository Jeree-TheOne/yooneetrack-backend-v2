import TaskService from "../Services/Task"
import HistoryService from "../Services/History"
import CommentService from "../Services/Comment"
import SpentTimeService from "../Services/SpentTime"
import FileService from "../Services/File"
import { Response } from "express"
import CustomRequest from "../Models/CustomRequest"

import ApiError from "../Exceptions/ApiError"
import { uploadFiles } from "../utils/multer"
import { capitalizeFirstLetter } from "../utils/formatters"

class TaskController {

  async create(req: CustomRequest, res: Response, next: Function) {
    try {
      uploadFiles(req, res, async (err) => {
        if (err) throw ApiError.BadRequest(err.message) 
        const { title, description, rowId, columnId, deskId, taskTypeId, initialAssessment, performerId } = req.body
        const { id: authorId } = req.user
        if (!title) throw ApiError.BadRequest('Заголовок не может быть пустым')
        const tags = req.body.tags ? Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags] : []
        const files = req.files ? await FileService.upload((req.files as Express.Multer.File[]).map(file => file.path)) : []
        await TaskService.create(title, description, authorId, rowId, columnId, deskId, taskTypeId, initialAssessment, performerId, tags, files )
        return res.status(200).send()
      })
    } catch (e) {
      next(e)
    }
  }

  async update(req: CustomRequest, res: Response, next: Function) {
    try {
      uploadFiles(req, res, async (err) => {
        if (err) throw ApiError.BadRequest(err.message) 
        else if (req.files) {
          const { id } = req.params
          const { id: userId } = req.user
          const { title } = req.body
          const tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]
          if (!title) throw ApiError.BadRequest('Заголовок не может быть пустым')
          const files = await FileService.upload((req.files as Express.Multer.File[]).map(file => file.path))

          const oldTask = await TaskService.getTaskUpdatable(id)

          const updatedFields = []
          const fieldsValues = []
          const previousValues = []

          Object.keys(req.body).forEach(key => {
            if (key === 'tags') return
            if (oldTask[key] === undefined) throw ApiError.BadRequest(`Поле ${key} недопустимо`)
            if (oldTask[key] == req.body[key]) return
            
            updatedFields.push(key)
            fieldsValues.push(req.body[key])
            previousValues.push(oldTask[key])
          })

          if (oldTask.files !== files) {
            updatedFields.push('files')
            fieldsValues.push(files)
            previousValues.push(oldTask.files)
          } 

          if (oldTask.tags.toString() !== tags.toString()) {
            updatedFields.push('tags')
            fieldsValues.push(tags)
            previousValues.push(oldTask.tags)
          } 
          HistoryService.create(id, userId, updatedFields, fieldsValues, previousValues)
          TaskService.update(id, userId)
          await Promise.all(updatedFields.map((field, index) => TaskService[`update${capitalizeFirstLetter(field)}`](id, fieldsValues[index])))
          return res.status(200).send()
        }
      })
    } catch (e) {
      next(e)
    }
  }

  async select(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    try {
      const task = await TaskService.getTask(id)
      return res.status(200).json(task)
    } catch (e) {
      next(e)
    }
  }

  async wall(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    try {
      const wall = await TaskService.getTaskWall(id)
      return res.status(200).json(wall)
    } catch (e) {
      next(e)
    }
  }

  async addComment(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    const { id: userId } = req.user
    const { text } = req.body
    try {
      await CommentService.create(id, userId, text)
      return res.status(200).json()
    } catch (e) {
      next(e)
    }
  }

  async addSpentTime(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    const { id: userId } = req.user
    const { spentTime } = req.body
    try {
      await SpentTimeService.create(id, userId, spentTime)
      return res.status(200).json()
    } catch (e) {
      next(e)
    }
  }

  async delete(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    try {
      await TaskService.delete(id)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }
}

export default new TaskController()