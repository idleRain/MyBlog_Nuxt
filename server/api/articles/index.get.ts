import type { Article, ArticleListItem, PaginatedResponse, ArticlesQueryParams } from '~/types'
import { articlesQuerySchema } from '~/schemas'

// Mock data - replace with actual database queries
const mockArticles: Article[] = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 最佳实践',
    slug: 'vue3-composition-api-best-practices',
    summary: '深入探讨 Vue 3 组合式 API 的设计理念和使用技巧，帮助你写出更优雅的代码。',
    content: `
      <h2 id="introduction">引言</h2>
      <p>Vue 3 的组合式 API 是一种全新的组件逻辑组织方式。它允许我们将相关的代码逻辑组织在一起，而不是分散在各个选项中。</p>
      
      <h2 id="setup-function">setup 函数</h2>
      <p>setup 函数是组合式 API 的入口点。它在组件创建之前执行，接收 props 和 context 作为参数。</p>
      
      <h3 id="setup-props">Props</h3>
      <p>Props 是响应式的，当传入的 props 发生变化时，组件会自动更新。</p>
      
      <h2 id="conclusion">总结</h2>
      <p>组合式 API 提供了更灵活的代码组织方式，特别适合大型项目和逻辑复用场景。</p>
    `,
    cover: 'https://picsum.photos/seed/vue3/800/400',
    status: 'published',
    viewCount: 1234,
    likeCount: 128,
    commentCount: 32,
    readingTime: 10,
    author: {
      id: 1,
      username: 'zhangsan',
      nickname: '张三',
      avatar: 'https://picsum.photos/seed/author/100/100',
    },
    category: {
      id: 1,
      name: 'Vue.js',
      slug: 'vuejs',
    },
    tags: [
      { id: 1, name: 'Vue3', slug: 'vue3' },
      { id: 2, name: 'TypeScript', slug: 'typescript' },
    ],
    publishedAt: '2024-01-15',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'Nuxt 3 全栈开发指南',
    slug: 'nuxt3-fullstack-guide',
    summary: '从零开始学习 Nuxt 3，构建现代化的全栈 Web 应用。',
    content: '<p>Nuxt 3 是一个基于 Vue 3 的全栈框架...</p>',
    cover: 'https://picsum.photos/seed/nuxt3/800/400',
    status: 'published',
    viewCount: 892,
    likeCount: 96,
    commentCount: 18,
    readingTime: 15,
    author: {
      id: 1,
      username: 'zhangsan',
      nickname: '张三',
      avatar: 'https://picsum.photos/seed/author/100/100',
    },
    category: {
      id: 2,
      name: 'Nuxt',
      slug: 'nuxt',
    },
    tags: [
      { id: 3, name: 'Nuxt3', slug: 'nuxt3' },
      { id: 4, name: 'SSR', slug: 'ssr' },
    ],
    publishedAt: '2024-01-10',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: 3,
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    summary: '掌握 TypeScript 的高级类型系统，提升代码的类型安全性。',
    content: '<p>TypeScript 提供了强大的类型系统...</p>',
    cover: 'https://picsum.photos/seed/typescript/800/400',
    status: 'published',
    viewCount: 567,
    likeCount: 72,
    commentCount: 12,
    readingTime: 8,
    author: {
      id: 1,
      username: 'zhangsan',
      nickname: '张三',
      avatar: 'https://picsum.photos/seed/author/100/100',
    },
    category: {
      id: 3,
      name: 'TypeScript',
      slug: 'typescript',
    },
    tags: [
      { id: 2, name: 'TypeScript', slug: 'typescript' },
    ],
    publishedAt: '2024-01-05',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
]

export default defineEventHandler(async (event): Promise<PaginatedResponse<ArticleListItem>> => {
  const query = getQuery(event)
  
  // Validate query params
  const params = articlesQuerySchema.parse({
    page: query.page || 1,
    pageSize: query.pageSize || 10,
    status: query.status,
    category: query.category,
    tag: query.tag,
    keyword: query.keyword,
    sortBy: query.sortBy || 'publishedAt',
    sortOrder: query.sortOrder || 'desc',
  })

  // Filter articles
  let filtered = [...mockArticles]

  // Status filter
  if (params.status) {
    filtered = filtered.filter((a) => a.status === params.status)
  }

  // Category filter
  if (params.category) {
    filtered = filtered.filter((a) => a.category.slug === params.category)
  }

  // Tag filter
  if (params.tag) {
    filtered = filtered.filter((a) => a.tags.some((t) => t.slug === params.tag))
  }

  // Keyword search
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(keyword) ||
        a.summary.toLowerCase().includes(keyword)
    )
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[params.sortBy as keyof Article] || 0
    const bVal = b[params.sortBy as keyof Article] || 0
    return params.sortOrder === 'desc'
      ? (bVal > aVal ? 1 : -1)
      : (aVal > bVal ? 1 : -1)
  })

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / params.pageSize)
  const startIndex = (params.page - 1) * params.pageSize
  const endIndex = startIndex + params.pageSize
  const paginatedArticles = filtered.slice(startIndex, endIndex)

  // Transform to list items
  const data: ArticleListItem[] = paginatedArticles.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    summary: article.summary,
    cover: article.cover,
    status: article.status,
    viewCount: article.viewCount,
    likeCount: article.likeCount,
    commentCount: article.commentCount,
    readingTime: article.readingTime,
    category: article.category,
    tags: article.tags,
    publishedAt: article.publishedAt,
    createdAt: article.createdAt,
  }))

  return {
    data,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrev: params.page > 1,
  }
})
