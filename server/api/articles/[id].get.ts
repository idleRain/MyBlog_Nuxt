import type { Article } from '~/types'

// Mock data - should match articles/index.get.ts
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
      
      <h3 id="setup-context">Context</h3>
      <p>Context 对象包含 attrs、slots、emit 和 expose 等属性。</p>
      
      <h2 id="reactivity">响应式系统</h2>
      <p>Vue 3 提供了 ref 和 reactive 两种响应式 API。</p>
      
      <h3 id="ref">ref</h3>
      <p>ref 用于创建基本类型的响应式数据，也可以用于对象类型。</p>
      
      <h3 id="reactive">reactive</h3>
      <p>reactive 用于创建对象类型的响应式数据。</p>
      
      <h2 id="computed">计算属性</h2>
      <p>computed 函数用于创建计算属性，它会自动追踪依赖并缓存结果。</p>
      
      <h2 id="watch">侦听器</h2>
      <p>watch 和 watchEffect 用于侦听响应式数据的变化。</p>
      
      <h2 id="lifecycle">生命周期钩子</h2>
      <p>组合式 API 提供了 onMounted、onUpdated、onUnmounted 等生命周期钩子函数。</p>
      
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

export default defineEventHandler(async (event): Promise<Article> => {
  const id = parseInt(getRouterParam(event, 'id') || '0')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Invalid article ID',
    })
  }

  const article = mockArticles.find((a) => a.id === id)

  if (!article) {
    throw createError({
      statusCode: 404,
      message: 'Article not found',
    })
  }

  // Increment view count (in real app, update database)
  article.viewCount++

  return article
})
