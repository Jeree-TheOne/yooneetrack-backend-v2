import { Request, Response } from 'express';

import AuthService from '../Services/Auth'

class AuthController {
  async registration(req: Request<{},{},{ email: string, password:string }>, res: Response, next: Function) {
    try {
      const {email, password} = req.body
      await AuthService.registration(email, password)
      return res.status(200).json()
    } catch (e) {
      next(e)
    }
  }

  async login(req: Request<{},{},{ login: string, password:string }>, res: Response, next: Function) {
    try {
      const userAgent = req.headers['user-agent']
      if (!userAgent) return res.status(300).send('Invalid user-agent')
      const {login, password} = req.body
      const userData = await AuthService.login(login, password, userAgent)
      res.cookie('refresh-token', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout(req: Request, res: Response, next: Function) {
    try {
      const userAgent = req.headers['user-agent']
      if (!userAgent) return res.status(300).send('Invalid user-agent')
      await AuthService.logout(req.cookies['refresh-token'], userAgent)
      res.clearCookie('refresh-token')
      res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async activate(req: Request<{ link: string }, {}, {}>, res: Response, next: Function) {
    try {
      const activationLink = req.params.link
      await AuthService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL as string)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req: Request, res: Response, next: Function) {
    try {
      const userAgent = req.headers['user-agent']
      if (!userAgent) return res.status(300).send('Invalid user-agent')
      const userData = await AuthService.refresh(req.cookies['refresh-token'], userAgent)
      res.cookie('refresh-token', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
}

export default new AuthController();