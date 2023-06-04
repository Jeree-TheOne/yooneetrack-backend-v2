import ApiError from "../Exceptions/ApiError"
import { db } from "../utils/db"
import User from "../Models/User"
import TokenData from "../Models/TokenData"

import EmailService from "../Services/Email"
import TokenService from "../Services/Token"
import UserService from "../Services/User"

import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import UserWithPassword from "../Models/UserWithPassword"

class AuthService {
  async registration(email: string, password: string): Promise<void> {
    const candidate = await db.user.findFirst({ 
      where: { email }
    })

    if (candidate) throw ApiError.BadRequest('Пользователь c таким почтовым адресом уже существует')

    const hashPassword = await bcrypt.hash(password, 10)
    const activationLink = uuid()

    await db.user.create({
      data: {
        id: activationLink,
        login: email,
        email,
        password: hashPassword,
      }
    })

    await EmailService.sendActivationMail(email, activationLink)
  }

  async login(login: string, password: string, userAgent: string): Promise<TokenData> {
    const user = await UserService.findByLoginOrEmail(login)

    if (!user) throw ApiError.BadRequest('Пользователя c таким логином не существует')

    if (!user.isActivated) throw ApiError.BadRequest('Аккаунт не активирован')

    const isPassEquals = await bcrypt.compare(password, user.password)

    if (!isPassEquals) throw ApiError.BadRequest('Некорректный пароль')

    return this.generateToken(user, userAgent)
  }

  async refresh(refreshToken: string, userAgent: string): Promise<TokenData>  {
    if (!refreshToken) throw ApiError.Unauthorized()

    const userData = TokenService.validateRefreshToken<User>(refreshToken)
    const tokenFromDb = await TokenService.tokenFromDb(refreshToken)

    if (!userData || !tokenFromDb) throw ApiError.Unauthorized()

    const userFromDb = await UserService.findById(userData.id) as UserWithPassword

    return this.generateToken(userFromDb, userAgent)
  }

  async activate(activationLink: string) {
    const user = await UserService.findById(activationLink)
    if (!user) throw ApiError.BadRequest('Некорректная ссылка активации')

    await db.user.update({
      where: { id: activationLink },
      data: { isActivated: true }
    })
  }

  async logout(refreshToken: string, userAgent: string) {
    await TokenService.removeToken(refreshToken, userAgent)
  }

  async generateToken(user: UserWithPassword, userAgent: string): Promise<TokenData> {
    const { password, ...userData } = user
    const tokens = TokenService.generateToken({...userData})
    await TokenService.saveToken(user.id, userAgent, tokens.refreshToken)

    return {
      ...tokens,
      user: userData
    }
  }
}

export default new AuthService()