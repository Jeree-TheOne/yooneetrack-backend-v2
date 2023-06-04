import WorkspaceService from "../Services/Workspace"
import { Response } from "express"
import CustomRequest from "../Models/CustomRequest"

import ApiError from "../Exceptions/ApiError"

class WorkspaceController {

  async selectAll(req: CustomRequest, res: Response, next: Function) {
    try {
      const { id } = req.user
      const workspaces = await WorkspaceService.selectAvailable(id)
      return res.status(200).json(workspaces)
    } catch (e) {
      next(e)
    }
  }

  async selectOne(req: CustomRequest, res: Response, next: Function) {
    try {
      const { id } = req.params
      const workspace = await WorkspaceService.selectOne(id)
      return res.status(200).json(workspace)
    } catch (e) {
      next(e)
    }
  }

  async create(req: CustomRequest, res: Response, next: Function): Promise<any>{
    try {
      const { name } = req.body
      console.log(req.user);
      const { id: userId } = req.user
      if (!name) throw ApiError.BadRequest('Не указано название рабочего пространства')
      const { id } = await WorkspaceService.create(name, userId)
      return res.status(200).json({ id })
    } catch (e) {
      next(e)
    }
  }

  async update(req: CustomRequest, res: Response, next: Function) {
    try {
      const { id } = req.params
      const { name } = req.body
      
      await WorkspaceService.update(id, name)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async delete(req: CustomRequest, res: Response, next: Function) {
    try {
      const { id } = req.params

      await WorkspaceService.delete(id)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }
}

export default new WorkspaceController()