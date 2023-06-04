import { db } from "../utils/db"

import Column from "../Models/Column"

class ColumnService {
  async create(name: string, workspaceId: string): Promise<Column> {
    return await db.column.create({ data: { name, workspaceId } })
  }

  async update(id: string, name: string): Promise<void> {
    await db.column.update({ where: { id } , data: { name } })
  }

  async delete(id: string): Promise<void> {
    await db.column.delete({ where: { id }})
  }
}

export default new ColumnService()