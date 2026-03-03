export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const pool = useMySQL()

  // Get published articles
  const [articles] = await pool.execute(
    `SELECT 
      a.id, a.title, a.slug, a.summary, a.content, a.created_at, a.updated_at,
      c.name as category_name,
      u.username as author_name, u.nickname as author_nickname
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.author_id = u.id
    WHERE a.status = 'published'
    ORDER BY a.published_at DESC
    LIMIT 20`
  )

  const siteUrl = config.public.siteUrl as string
  const siteTitle = 'My Blog'
  const siteDescription = 'A personal blog built with Nuxt 3'

  // Generate RSS XML
  const rssItems = (articles as Record<string, unknown>[])
    .map((article) => {
      const articleUrl = `${siteUrl}/articles/${article.id}`
      const pubDate = new Date(article.created_at as Date).toUTCString()
      const content = article.content as string
      const summary = article.summary as string
      const description = summary || content.substring(0, 200)

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${article.author_nickname || article.author_name}</author>
      <category>${article.category_name || 'Uncategorized'}</category>
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteTitle}</title>
    <link>${siteUrl}</link>
    <description>${siteDescription}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`

  setResponseHeaders(event, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })

  return rss
})
