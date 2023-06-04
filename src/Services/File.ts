import { db } from "../utils/db"

class FileService {
  async upload(path: string[]) {
    const files = await Promise.all(path.map(path => this.uploadSingle(path)))
    return files
  }

  async uploadSingle(path: string): Promise<string> {
    const file = await db.file.create({
      data: { path: path.replace('storage\\', '') }
    })
    return file.id
  }

  async selectFiles(files_id: string[]) {
    if (!files_id.length) return []
    const files = await db.file.findMany({
      where: { id: { in: files_id } }
    })
    return [files.map(file => file.path)]
  }
}

export default new FileService()