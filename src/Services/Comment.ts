import { db } from "../utils/db"

import Comment from "../Models/Comment"

class CommentService {
  async create(taskId: string, userId: string, text: string): Promise<Comment> {
    return await db.comment.create({ data: { taskId, userId, text } })
  }

  async getAllComments(taskId: string): Promise<Comment[]> {
    const comments = await db.comment.findMany({ where: { taskId } })
    return comments.map(comment => { 
      return {
        ...comment,
        type: 'comment'
      }
    })
  }
}

export default new CommentService()