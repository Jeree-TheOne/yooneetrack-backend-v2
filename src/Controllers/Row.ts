import RowService from "../Services/Row"
import { Response } from "express"
import CustomRequest from "../Models/CustomRequest"

import ApiError from "../Exceptions/ApiError"

class RowController {

  async create(req: CustomRequest, res: Response, next: Function) {
    const { name } = req.body
    const { workspace } = req
    try {
      if (!name) throw ApiError.BadRequest('Не указано название категории')
      await RowService.create(name, workspace)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async update(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    const { name } = req.body
    try {
      await RowService.update(id, name)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async delete(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    try {
      await RowService.delete(id)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }
}

export default new RowController()