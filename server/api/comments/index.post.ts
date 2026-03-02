import { z } from 'zod'
import { successResponse, paginatedResponse, errorResponse } from '~/server/utils/response'

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  articleId: z.coerce.number().int().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'spam']).optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const validatedQuery = querySchema.parse(query)
    const { page, pageSize, articleId, status } = validatedQuery

    const pool = useMySQL()
    const offset = (page - 1) * pageSize

    // Build query conditions
    const conditions: string[] = []
    const params: (string | number)[] = []

    if (articleId) {
      conditions.push('c.article_id = ?')
      params.push(articleId)
    }

    if (status) {
      conditions.push('c.status = ?')
      params.push(status)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM comments c ${whereClause}`
    const [countResult] = await pool.execute(countSql, params)
    const total = (countResult as [{ total: number }])[0]?.total || 0

    // Get comments
    const commentsSql = `
      SELECT 
        c.id, c.content, c.status, c.created_at, c.updated_at, c.parent_id,
        c.article_id, a.title as article_title,
        u.id as user_id, u.username as user_name, u.nickname as user_nickname, u.avatar as user_avatar
      FROM comments c
      LEFT JOIN articles a ON c.article_id = a.id
      LEFT JOIN users u ON c.user_id = u.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `

    const [comments] = await pool.execute(commentsSql, [...params, pageSize, offset])

    const formattedComments = (comments as Record<string, unknown>[]).map((comment) => ({
      id: comment.id,
      content: comment.content,
      status: comment.status,
      createdAt: (comment.created_at as Date).toISOString(),
      updatedAt: (comment.updated_at as Date).toISOString(),
      parentId: comment.parent_id,
      article: {
        id: comment.article_id,
        title: comment.article_title,
      },
      user: {
        id: comment.user_id,
        username: comment.user_name,
        nickname: comment.user_nickname,
        avatar: comment.user_avatar,
      },
    }))

    return paginatedResponse(formattedComments, total, page, pageSize)
  } catch (error) {
    console.error('Get comments error:', error)
    if (error instanceof z.ZodError) {
      return errorResponse('参数格式错误')
    }
    return errorResponse('获取评论列表失败')
  }
})
