import DeskService from "../Services/Desk"
import { Response } from "express"
import CustomRequest from "../Models/CustomRequest"

import ApiError from "../Exceptions/ApiError"

class DeskController {

  async selectOne(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    try {
      const desk = await DeskService.selectOne(id)
      return res.status(200).json(desk)
    } catch (e) {
      next(e)
    }
  }

  async create(req: CustomRequest, res: Response, next: Function) {
    console.log(req.body);
    const { name, isCurrent } = req.body
    const { workspace } = req
    try {
      if (!name) throw ApiError.BadRequest('Не указано название доски')
      await DeskService.create(name, workspace, isCurrent)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async update(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    const { name } = req.body
    try {
      await DeskService.update(id, name)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async setCurrent(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    const { workspace } = req
    try {
      await DeskService.setCurrent(id, workspace)
      res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async delete(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    try {
      await DeskService.delete(id)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }
}

export default new DeskController()