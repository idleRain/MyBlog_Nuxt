import { z } from 'zod'
import { successResponse, paginatedResponse, errorResponse } from '~/server/utils/response'

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  category: z.string().optional(),
  tag: z.string().optional(),
  keyword: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const validatedQuery = querySchema.parse(query)
    const { page, pageSize, category, tag, keyword, status } = validatedQuery

    const pool = useMySQL()
    const offset = (page - 1) * pageSize

    // Build query conditions
    const conditions: string[] = []
    const params: (string | number)[] = []

    if (category) {
      conditions.push('c.slug = ?')
      params.push(category)
    }

    if (keyword) {
      conditions.push('(a.title LIKE ? OR a.summary LIKE ? OR a.content LIKE ?)')
      const keywordParam = `%${keyword}%`
      params.push(keywordParam, keywordParam, keywordParam)
    }

    if (status) {
      conditions.push('a.status = ?')
      params.push(status)
    } else {
      conditions.push('a.status = ?')
      params.push('published')
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count
    const countSql = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      ${whereClause}
    `
    const [countResult] = await pool.execute(countSql, params)
    const total = (countResult as [{ total: number }])[0]?.total || 0

    // Get articles
    const articlesSql = `
      SELECT 
        a.id, a.title, a.slug, a.summary, a.cover, a.view_count, a.like_count, a.comment_count,
        a.status, a.created_at, a.updated_at, a.published_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        u.id as author_id, u.username as author_name, u.nickname as author_nickname, u.avatar as author_avatar
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
      ${whereClause}
      ORDER BY a.published_at DESC, a.created_at DESC
      LIMIT ? OFFSET ?
    `

    const [articles] = await pool.execute(articlesSql, [...params, pageSize, offset])

    // Get tags for each article
    const articleIds = (articles as { id: number }[]).map((a) => a.id)
    let tagsMap: Record<number, { id: number; name: string; slug: string }[]> = {}

    if (articleIds.length > 0) {
      const placeholders = articleIds.map(() => '?').join(',')
      const tagsSql = `
        SELECT t.id, t.name, t.slug, at.article_id
        FROM article_tags at
        JOIN tags t ON at.tag_id = t.id
        WHERE at.article_id IN (${placeholders})
      `
      const [tagResults] = await pool.execute(tagsSql, articleIds)

      for (const tag of tagResults as { article_id: number; id: number; name: string; slug: string }[]) {
        if (!tagsMap[tag.article_id]) {
          tagsMap[tag.article_id] = []
        }
        tagsMap[tag.article_id].push({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        })
      }
    }

    // Format response
    const formattedArticles = (articles as Record<string, unknown>[]).map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      cover: article.cover,
      viewCount: article.view_count,
      likeCount: article.like_count,
      commentCount: article.comment_count,
      status: article.status,
      createdAt: (article.created_at as Date).toISOString(),
      updatedAt: (article.updated_at as Date).toISOString(),
      publishedAt: article.published_at ? (article.published_at as Date).toISOString() : null,
      category: article.category_id
        ? {
            id: article.category_id,
            name: article.category_name,
            slug: article.category_slug,
          }
        : null,
      author: {
        id: article.author_id,
        username: article.author_name,
        nickname: article.author_nickname,
        avatar: article.author_avatar,
      },
      tags: tagsMap[article.id as number] || [],
    }))

    return paginatedResponse(formattedArticles, total, page, pageSize)
  } catch (error) {
    console.error('Get articles error:', error)
    if (error instanceof z.ZodError) {
      return errorResponse('参数格式错误')
    }
    return errorResponse('获取文章列表失败')
  }
})
