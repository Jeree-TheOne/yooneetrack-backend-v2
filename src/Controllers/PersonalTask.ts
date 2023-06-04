import PersonalTaskService from "../Services/PersonalTask"
import FileService from "../Services/File"
import { Response } from "express"
import CustomRequest from "../Models/CustomRequest"

import ApiError from "../Exceptions/ApiError"
import { uploadFiles } from "../utils/multer"

class PersonalTaskController {

  async create(req: CustomRequest, res: Response, next: Function) {
    try {
      uploadFiles(req, res, async (err) => {
        if (err) throw ApiError.BadRequest(err.message) 
        const { title, description, isImportant, isUrgent, deadline  } = req.body
        const { id } = req.user
        if (!title) throw ApiError.BadRequest('Заголовок не может быть пустым')
        const files = req.files ? await FileService.upload((req.files as Express.Multer.File[]).map(file => file.path)) : []
        await PersonalTaskService.create(id, title, description, isImportant, isUrgent, deadline, files)
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
        const { title, description, isImportant, isUrgent, isDone, deadline  } = req.body
        const { id } = req.params
        if (!title) throw ApiError.BadRequest('Заголовок не может быть пустым')
        const files = req.files ? await FileService.upload((req.files as Express.Multer.File[]).map(file => file.path)) : []
        await PersonalTaskService.update(id, title, description, isImportant, isUrgent, isDone, deadline, files)
        return res.status(200).send()
      })
    } catch (e) {
      next(e)
    }
  }

  async selectAll(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    try {
      const tasks = await PersonalTaskService.select(id)
      return res.status(200).json(tasks)
    } catch (e) {
      next(e)
    }
  }

  async delete(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    try {
      await PersonalTaskService.delete(id)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }
}

export default new PersonalTaskController()