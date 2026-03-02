import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id || isNaN(parseInt(id))) {
      return errorResponse('文章 ID 无效')
    }

    const pool = useMySQL()

    // Get article
    const [articles] = await pool.execute(
      `SELECT 
        a.id, a.title, a.slug, a.summary, a.content, a.cover, a.view_count, a.like_count, a.comment_count,
        a.status, a.created_at, a.updated_at, a.published_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        u.id as author_id, u.username as author_name, u.nickname as author_nickname, 
        u.avatar as author_avatar, u.bio as author_bio
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ?`,
      [id]
    )

    if (!Array.isArray(articles) || articles.length === 0) {
      return errorResponse('文章不存在')
    }

    const article = articles[0] as Record<string, unknown>

    // Get tags
    const [tags] = await pool.execute(
      `SELECT t.id, t.name, t.slug 
       FROM article_tags at
       JOIN tags t ON at.tag_id = t.id
       WHERE at.article_id = ?`,
      [id]
    )

    // Increment view count
    await pool.execute('UPDATE articles SET view_count = view_count + 1 WHERE id = ?', [id])

    return successResponse({
      id: article.id,
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      cover: article.cover,
      viewCount: (article.view_count as number) + 1,
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
        bio: article.author_bio,
      },
      tags: tags,
    })
  } catch (error) {
    console.error('Get article error:', error)
    return errorResponse('获取文章详情失败')
  }
})
