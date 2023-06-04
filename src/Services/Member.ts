import { db } from "../utils/db"

import Member from "../Models/Member"
import ApiError from "../Exceptions/ApiError"

class MemberService {
  
  async add(userId: string, workspaceId: string, roleId: string): Promise<string> {
    const { id } = await db.member.create({ data: { userId, workspaceId, roleId } })
    return id
  }

  async update(id: string, roleId: string): Promise<void> {
    await db.member.update({ where: { id }, data: { roleId } })
  }

  async blockMember(id: string, isBlocked): Promise<void> {
    await db.member.update({ where: { id }, data: { isBlocked } })
  }

  async activateMember(id: string): Promise<string> {
    const member = await db.member.findFirst({ where: { id } })
    if (!member) throw ApiError.BadRequest('Некорректная ссылка активации')

    await db.member.update({ where: { id }, data: { isActivated: true } })
    return member.workspaceId
  }

  async isWorkspaceAvailable(userId: string, workspaceId: string): Promise<boolean> {
    const member = await db.member.findFirst({ where: { AND: [ { workspaceId }, { userId }, { isBlocked: false }, { isActivated: true} ] } })
    if (member) return true
    return false
  }
}

export default new MemberService()