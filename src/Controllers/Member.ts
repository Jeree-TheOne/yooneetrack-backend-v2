import MemberService from "../Services/Member"
import { Response } from "express"
import CustomRequest from "../Models/CustomRequest"

class MemberController {

  async add(req: CustomRequest, res: Response, next: Function) {
    const { workspace } = req
    const { userId, roleId } = req.body
    try {
      await MemberService.add(userId, workspace, roleId)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async update(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    const { roleId } = req.body
    try {
      await MemberService.update(id, roleId)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async block(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    const { isBlocked } = req.body
    try {
      await MemberService.blockMember(id, isBlocked)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async activate(req: CustomRequest, res: Response, next: Function) {
    const { id } = req.params
    try {
      const workspace = await MemberService.activateMember(id)
      return res.redirect(`${process.env.CLIENT_URL as string}/workspace/${workspace}`)
    } catch (e) {
      next(e)
    }
  }
}

export default new MemberController()