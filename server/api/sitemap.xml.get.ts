export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const pool = useMySQL()

  const siteUrl = config.public.siteUrl as string

  // Get all published articles
  const [articles] = await pool.execute(
    `SELECT id, updated_at FROM articles WHERE status = 'published' ORDER BY published_at DESC`
  )

  // Get all categories
  const [categories] = await pool.execute(
    `SELECT slug, updated_at FROM categories`
  )

  // Get all tags
  const [tags] = await pool.execute(
    `SELECT slug, created_at FROM tags`
  )

  // Static pages
  const staticPages = [
    { url: '', changefreq: 'daily', priority: 1.0 },
    { url: '/articles', changefreq: 'daily', priority: 0.9 },
    { url: '/archives', changefreq: 'weekly', priority: 0.8 },
    { url: '/about', changefreq: 'monthly', priority: 0.7 },
  ]

  // Generate sitemap XML
  const urls: string[] = []

  // Add static pages
  for (const page of staticPages) {
    urls.push(`
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  }

  // Add article pages
  for (const article of articles as { id: number; updated_at: Date }[]) {
    const lastmod = new Date(article.updated_at).toISOString().split('T')[0]
    urls.push(`
  <url>
    <loc>${siteUrl}/articles/${article.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
  }

  // Add category pages
  for (const category of categories as { slug: string; updated_at: Date }[]) {
    urls.push(`
  <url>
    <loc>${siteUrl}/categories/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
  }

  // Add tag pages
  for (const tag of tags as { slug: string; created_at: Date }[]) {
    urls.push(`
  <url>
    <loc>${siteUrl}/tags/${tag.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`)
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`

  setResponseHeaders(event, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })

  return sitemap
})
