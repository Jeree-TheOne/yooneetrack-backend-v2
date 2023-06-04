import { db } from "../utils/db"

import History from "../Models/History"

class HistoryService {
  async create(taskId: string, userId: string, updatedFields: string[], fieldsValues: string[] | string[][], previousValues: string[] | string[][]): Promise<History> {
    return await db.history.create({ data: { taskId, userId, updatedFields, fieldsValues: fieldsValues.map(value => String(value)), previousValues: previousValues.map(value => String(value)) } })
  }

  async getAllHistories(taskId: string): Promise<History[]> {
    const histories = await db.history.findMany({ where: { taskId } })
    return histories.map(history => { 
      return {
        ...history,
        type: 'history'
      }
    })
  }
}

export default new HistoryService()