import TagService from "../Services/Tag"
import { Response } from "express"
import CustomRequest from "../Models/CustomRequest"

import ApiError from "../Exceptions/ApiError"

class TagController {

  async create(req: CustomRequest, res: Response, next: Function) {
    const { name, background, color } = req.body
    const { workspace } = req
    try {
      if (!name) throw ApiError.BadRequest('Не указано название тэга')
      await TagService.create(name, background, color, workspace)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async update(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    const { name, background, color } = req.body
    try {
      await TagService.update(id, name, background, color)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async delete(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    try {
      await TagService.delete(id)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }
}

export default new TagController()