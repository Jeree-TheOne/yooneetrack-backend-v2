import { db } from "../utils/db"

import Tag from "../Models/Tag"

class TagService {
  async create(name: string, background: string, color: string, workspaceId: string): Promise<Tag> {
    return await db.tag.create({ data: { name, background, color, workspaceId } })
  }

  async update(id: string, name: string, background: string, color: string): Promise<void> {
    await db.tag.update({ where: { id } , data: { name, background, color } })
  }

  async delete(id: string): Promise<void> {
    await db.tag.delete({ where: { id }})
  }
}

export default new TagService()