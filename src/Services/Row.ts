import { db } from "../utils/db"

import Row from "../Models/Row"

class RowService {
  async create(name: string, workspaceId: string): Promise<void> {
    await db.row.create({ data: { name, workspaceId } })
  }

  async selectAll(workspaceId: string): Promise<Row[]>{
    return await db.row.findMany({ where: { workspaceId } })
  }

  async update(id: string, name: string): Promise<void> {
    await db.row.update({ where: { id } , data: { name } })
  }

  async delete(id: string): Promise<void> {
    await db.row.delete({ where: { id }})
  }
}

export default new RowService()