import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const pool = useMySQL()

    // Get article stats
    const [articleStats] = await pool.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
        SUM(view_count) as total_views
      FROM articles`
    )

    // Get comment stats
    const [commentStats] = await pool.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM comments`
    )

    // Get user stats
    const [userStats] = await pool.execute(
      `SELECT COUNT(*) as total FROM users`
    )

    // Get category stats
    const [categoryStats] = await pool.execute(
      `SELECT 
        c.id, c.name, c.slug,
        COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
      GROUP BY c.id
      ORDER BY article_count DESC
      LIMIT 10`
    )

    // Get tag stats
    const [tagStats] = await pool.execute(
      `SELECT 
        t.id, t.name, t.slug,
        COUNT(at.article_id) as article_count
      FROM tags t
      LEFT JOIN article_tags at ON t.id = at.tag_id
      LEFT JOIN articles a ON at.article_id = a.id AND a.status = 'published'
      GROUP BY t.id
      ORDER BY article_count DESC
      LIMIT 10`
    )

    // Get recent views (last 30 days)
    const [recentViews] = await pool.execute(
      `SELECT 
        DATE(created_at) as date,
        SUM(view_count) as views
      FROM articles
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC`
    )

    return successResponse({
      articles: {
        total: (articleStats as [{ total: number; published: number; draft: number; total_views: number }])[0]?.total || 0,
        published: (articleStats as [{ total: number; published: number; draft: number; total_views: number }])[0]?.published || 0,
        draft: (articleStats as [{ total: number; published: number; draft: number; total_views: number }])[0]?.draft || 0,
        totalViews: (articleStats as [{ total: number; published: number; draft: number; total_views: number }])[0]?.total_views || 0,
      },
      comments: {
        total: (commentStats as [{ total: number; approved: number; pending: number }])[0]?.total || 0,
        approved: (commentStats as [{ total: number; approved: number; pending: number }])[0]?.approved || 0,
        pending: (commentStats as [{ total: number; approved: number; pending: number }])[0]?.pending || 0,
      },
      users: {
        total: (userStats as [{ total: number }])[0]?.total || 0,
      },
      categories: categoryStats,
      tags: tagStats,
      recentViews,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return errorResponse('获取统计数据失败')
  }
})
