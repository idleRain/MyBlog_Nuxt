import type { Tag } from '~/types'

// Mock data
const mockTags: Tag[] = [
  { id: 1, name: 'Vue3', slug: 'vue3', articleCount: 12, createdAt: '2024-01-01' },
  { id: 2, name: 'TypeScript', slug: 'typescript', articleCount: 18, createdAt: '2024-01-01' },
  { id: 3, name: 'Nuxt3', slug: 'nuxt3', articleCount: 8, createdAt: '2024-01-01' },
  { id: 4, name: 'SSR', slug: 'ssr', articleCount: 5, createdAt: '2024-01-01' },
  { id: 5, name: 'Composition API', slug: 'composition-api', articleCount: 10, createdAt: '2024-01-01' },
  { id: 6, name: 'Pinia', slug: 'pinia', articleCount: 6, createdAt: '2024-01-01' },
  { id: 7, name: 'TailwindCSS', slug: 'tailwindcss', articleCount: 9, createdAt: '2024-01-01' },
  { id: 8, name: 'Node.js', slug: 'nodejs', articleCount: 14, createdAt: '2024-01-01' },
  { id: 9, name: 'MySQL', slug: 'mysql', articleCount: 7, createdAt: '2024-01-01' },
  { id: 10, name: 'Docker', slug: 'docker', articleCount: 4, createdAt: '2024-01-01' },
]

export default defineEventHandler(async (): Promise<Tag[]> => {
  return mockTags
})
