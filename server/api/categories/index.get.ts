import type { Category } from '~/types'

// Mock data
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Vue.js',
    slug: 'vuejs',
    description: 'Vue.js 框架相关文章',
    articleCount: 15,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Nuxt',
    slug: 'nuxt',
    description: 'Nuxt 框架相关文章',
    articleCount: 8,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
  },
  {
    id: 3,
    name: 'TypeScript',
    slug: 'typescript',
    description: 'TypeScript 相关文章',
    articleCount: 12,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-05',
  },
  {
    id: 4,
    name: 'JavaScript',
    slug: 'javascript',
    description: 'JavaScript 基础和进阶',
    articleCount: 20,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12',
  },
  {
    id: 5,
    name: 'CSS',
    slug: 'css',
    description: 'CSS 样式和布局技巧',
    articleCount: 10,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-08',
  },
]

export default defineEventHandler(async (): Promise<Category[]> => {
  return mockCategories
})
