import { Response } from 'express'
import ApiError from '../Exceptions/ApiError'
import CustomRequest from '../Models/CustomRequest'
import TokenService from '../Services/Token'
import MemberService from '../Services/Member'
import User from '../Models/User'
// const MemberService = require('../Services/MemberService')

export default async function(req: CustomRequest, res: Response, next: Function) {
  try {
    const authorizationHeader = req.headers.authorization
    const workspace = req.headers.workspace as string
    if (!authorizationHeader) {
      return next(ApiError.Unauthorized())
    }
    const userData = TokenService.validateAccessToken<User>(authorizationHeader)
    if (!userData) {
      return next(ApiError.Unauthorized())
    }

    const data = TokenService.validateRefreshToken(req.cookies['refresh-token'])
    if (!data) {
      return next(ApiError.ExpiredToken())
    }

    const isWorkspaceAvailable = await MemberService.isWorkspaceAvailable(userData.id, workspace)
    if (isWorkspaceAvailable) req.workspace = workspace
    req.user = userData
    next()

  } catch (e) {
    return next(ApiError.Unauthorized())
  }
}