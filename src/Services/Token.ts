import jwt, { Secret } from 'jsonwebtoken';


import Token from "../Models/Token";
import User from "../Models/User";
import { db } from '../utils/db';

class TokenService {

  generateToken(payload: User): Token {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as Secret, {expiresIn: '15d'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as Secret, {expiresIn: '30d' })
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId: string, userAgent: string, refreshToken: string) {
    return await db.token.upsert({
      where: {
        tokenUnique: {
          userId,
          userAgent
        }
      },
      update: {
        refreshToken
      },
      create: {
        userId,
        userAgent,
        refreshToken
      }
    })
  }

  async removeToken(userId: string, userAgent: string) {
    await db.token.deleteMany({ where: { AND: { userId, userAgent } } })
  }

  validateAccessToken<T>(accessToken: string): T | null {
    try {
      return jwt.verify(accessToken.split(' ')[1], process.env.JWT_ACCESS_SECRET as Secret) as T
    } catch (e) {
      return null
    }
  }

  validateRefreshToken<T>(refreshToken: string): T | null {
    try {
      return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as Secret) as T
    } catch (e) {
      return null
    }
  }

  async tokenFromDb(refreshToken: string) {
    return db.token.findFirst({ where: { refreshToken } })
  }
}

export default new TokenService();