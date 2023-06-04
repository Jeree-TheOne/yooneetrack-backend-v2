import ApiError from "../Exceptions/ApiError"
import { db } from "../utils/db"

import Workspace from "../Models/Workspace"
import WorkspaceWithData from "../Models/WorkspaceWithData"

class WorkspaceService {
  async create(name: string, user: string): Promise<Workspace> {
    return await db.workspace.create({ 
      data: { 
        name,
        columns: { 
          create: [
            { name: 'Нужно сделать' },
            { name: 'В процессе' },
            { name: 'Готово' },
          ]
        },
        rows: { 
          create: [
            { name: 'Задачи'}
          ]
        },
        tags: {
          create: [
            { name: 'Важное', background: '#FF0000', color: '#000000' }
          ]
        },
        desks: {
          create: [
            { name: 'Доска', isCurrent: true }
          ]
        },
        taskTypes: {
          create: [
            { name: 'Задача' }
          ]
        },
        members: {
          create: [
            { userId: user, roleId: '66773b63-d458-49e0-9a13-edd156069521', isActivated: true }
          ]
        }
      },
    })
  }

  async selectAvailable(userId: string): Promise<Workspace[]>{
    return await db.workspace.findMany({ where: { members: { some: { userId } } } })
  }

  async selectOne(id: string): Promise<WorkspaceWithData> {
    const { members, ...data} = await db.workspace.findFirst({ 
      where: { id },
      include: {
        members: {
          where: { AND: [ { isActivated: true }, { isBlocked: false } ] },
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
                login: true,
                firstName: true,
                secondName: true,
                image: {
                  select: {
                    path: true
                  }
                }
              }
            },
            role: {
              select: {
                name: true
              }
            }
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            background: true,
            color: true
          }
        },
        taskTypes: {
          select: {
            id: true,
            name: true,
          }
        },
        rows: {
          select: {
            id: true,
            name: true
          }
        },
        columns: {
          select: {
            id: true,
            name: true
          }
        },
        desks: {
          select: {
            id: true,
            name: true,
            isCurrent: true
          },
          orderBy: { isCurrent: 'desc' }
        }
      } 
    })

    return {
      ...data,
      members: members.map(member => { 
        const { user, role: roleObj } = member
        const { name: role } = roleObj
        const { id, email, login, firstName, secondName, image } = user
        const { path: avatar } = image
        return {
          id, email, login, firstName, secondName, role, avatar
        } 
      })
    }
  }

  async update(id: string, name: string): Promise<void> {
    await db.workspace.update({ where: { id } , data: { name } })
  }

  async delete(id: string): Promise<void> {
    await db.workspace.delete({ where: { id } })
  }
}

export default new WorkspaceService()