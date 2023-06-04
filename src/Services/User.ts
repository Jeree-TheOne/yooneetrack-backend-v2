import ApiError from "../Exceptions/ApiError"
import { db } from "../utils/db"
import User from "../Models/User"
import UserWithPassword from "../Models/UserWithPassword"

import AuthService from "../Services/Auth"
import TokenData from "../Models/TokenData"

import bcrypt from 'bcrypt'

class UserService {
  async findByLoginOrEmail(loginOrEmail: string): Promise<UserWithPassword | null> {
    const user = await db.user.findFirst({ 
      where: { OR: [ { email: loginOrEmail }, { login: loginOrEmail } ] },
      include: {
        image: {
          select: {
            path: true
          }
        }
      },
    })
    if (!user) return null

    const { imageId, image, ...rest} = user

    if (!image) return {
      ...rest,
      avatar: undefined,
    } as UserWithPassword

    return {
      ...rest,
      avatar: image.path
    } as UserWithPassword
  }

  async findById(id: string): Promise<UserWithPassword | null> {
    const user = await db.user.findFirst({ 
      where: { id },
      include: {
        image: {
          select: {
            path: true
          }
        }
      },
    })

    const { imageId, image, ...rest} = user

    return {
      ...rest,
      avatar: image.path
    } as UserWithPassword
  }

  async changeAvatar(id: string, imageId: string, userAgent: string): Promise<TokenData> {
    const user = await db.user.update({
      where: { id },
      data: { imageId },
      include: {
        image: {
          select: {
            path: true
          }
        }
      }
    })

    const { image, imageId: _, ...rest} = user

    return AuthService.generateToken({
      ...rest,
      avatar: image.path
    } as UserWithPassword, userAgent)
  }

  async removeAvatar(id: string, userAgent: string): Promise<TokenData> {
    const user = await db.user.update({
      where: { id },
      data: { imageId: '21dee9ec-0e79-4dc0-9577-5052343f63fe' }, // дефолтная аватарка пользователя'
      include: {
        image: {
          select: {
            path: true
          }
        }
      }
    })
    const { image, imageId, ...rest} = user

    return AuthService.generateToken({
      ...rest,
      avatar: image.path
    } as UserWithPassword, userAgent)
  }

  async changePassword(id: string, oldPassword: string, newPassword: string, userAgent: string): Promise<TokenData> {
    try {
      const { password } = await db.user.findFirst({ where: { id } })
      const isPassEquals = await bcrypt.compare(oldPassword, password)
      if (!isPassEquals) throw ApiError.BadRequest('Неверный старый пароль')

      const hashNewPassword = await bcrypt.hash(newPassword, 10)
      await db.user.update({ where: { id }, data: { password: hashNewPassword } })
      const user = await this.findById(id)
      return AuthService.generateToken(user, userAgent)
    } catch (err) {
      throw ApiError.BadRequest()
    }
  }

  async changeName(id: string, firstName: string, secondName: string, userAgent: string): Promise<TokenData> {
    try {
      await db.user.update({ where: { id }, data: { firstName, secondName } })
      const user = await this.findById(id)
      return AuthService.generateToken(user, userAgent)
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }

  async changeLogin(id: string, login: string, userAgent: string): Promise<TokenData> {
    try {
      await db.user.update({ where: { id }, data: { login } })
      const user = await this.findById(id)
      return AuthService.generateToken(user, userAgent)
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }

  async blockUser(id: string, isBlocked: boolean, userAgent: string): Promise<TokenData> {
    try {
      await db.user.update({ where: { id }, data: { isBlocked } })
      const user = await this.findById(id)
      return AuthService.generateToken(user, userAgent)
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }

  async premiumUser(id: string, isPremium: boolean, userAgent: string): Promise<TokenData> {
    try {
      await db.user.update({ where: { id }, data: { isPremium } })
      const user = await this.findById(id)
      return AuthService.generateToken(user, userAgent)
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }
}

export default new UserService()