import { db } from "../utils/db"

import SpentTime from "../Models/SpentTime"

class SpentTimeService {
  async create(taskId: string, userId: string, spentTime: number): Promise<SpentTime> {
    const currentTime = await db.spentTime.findMany({
      where: { taskId }
    })
    const currentTimeSpent = currentTime.reduce((acc, item) => acc += item.spentTime, 0)
    return await db.spentTime.create({ data: { taskId, userId, spentTime, currentTimeSpent } })
  }

  async getAllSpentTimes(taskId: string): Promise<SpentTime[]> {
    const spentTimes = await db.spentTime.findMany({ where: { taskId } })
    return spentTimes.map(spentTime => { 
      return {
        ...spentTime,
        type: 'spentTime'
      }
    })
  }
}

export default new SpentTimeService()