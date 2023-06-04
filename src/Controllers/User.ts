import UserService from "../Services/User"
import FileService from "../Services/File"
import { Request, Response } from "express"
import { uploadAvatar } from "../utils/multer"
import ApiError from "../Exceptions/ApiError"
import CustomRequest from "../Models/CustomRequest"

/** Controller for user  */
class UserController {

  async uploadAvatar(req: CustomRequest, res: Response, next: Function) {
    try {
      uploadAvatar(req, res, async (err) => {
        if (err) {
          throw ApiError.BadRequest(err.message)
        } else if (req.file) {
          const userAgent = req.headers['user-agent']
          if (!userAgent) return res.status(300).send('Invalid user-agent')
          
          const { id } = req.user
          const imageId = await FileService.uploadSingle(req.file.path)
          const data = await UserService.changeAvatar(id, imageId, userAgent)
          return res.status(200).json(data)
        } else {
          return ApiError.BadRequest('Нет фотографии')
        }
      })
    } catch (e) {
      next(e)
    }
  }

  async removeAvatar(req: CustomRequest, res: Response, next: Function) {
    try {
      const userAgent = req.headers['user-agent']
      if (!userAgent) return res.status(300).send('Invalid user-agent')
      const { id } = req.user
      await UserService.removeAvatar(id, userAgent)
      return res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async changeName(req: CustomRequest, res: Response, next: Function) {
    try {
      const userAgent = req.headers['user-agent']
      if (!userAgent) return res.status(300).send('Invalid user-agent')

      const { id } = req.user
      const { firstName, secondName } = req.body
      const data = await UserService.changeName(id, firstName, secondName, userAgent)
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }

  async changeLogin(req: CustomRequest, res: Response, next: Function) {
    try {
      const userAgent = req.headers['user-agent']
      if (!userAgent) return res.status(300).send('Invalid user-agent')

      const { id } = req.user
      const { login } = req.body
      const data = await UserService.changeLogin(id, login, userAgent)
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }

  async blockUser(req: CustomRequest, res: Response, next: Function) {
    try {
      const userAgent = req.headers['user-agent']
      if (!userAgent) return res.status(300).send('Invalid user-agent')

      const { id } = req.user
      const { isBlocked } = req.body
      const data = await UserService.blockUser(id, isBlocked, userAgent)
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }

  async premiumUser(req: CustomRequest, res: Response, next: Function) {
    try {
      const userAgent = req.headers['user-agent']
      if (!userAgent) return res.status(300).send('Invalid user-agent')

      const { id } = req.user
      const { isPremium } = req.body
      const data = await UserService.premiumUser(id, isPremium, userAgent)
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }

  async changePassword(req: CustomRequest, res: Response, next: Function) {
    try {
      const userAgent = req.headers['user-agent']
      if (!userAgent) return res.status(300).send('Invalid user-agent')

      const { id } = req.user
      const { newPassword, oldPassword } = req.body
      if (newPassword === oldPassword) {
        next(ApiError.BadRequest('Новый пароль не должен совпадать со старым'))
      }
      const data = await UserService.changePassword(id, oldPassword, newPassword, userAgent)
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
}

export default new UserController()