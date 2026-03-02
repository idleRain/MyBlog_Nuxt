<template>
  <article class="space-y-8">
    <!-- Article Header -->
    <header class="space-y-4">
      <div class="flex items-center space-x-2 text-sm text-muted-foreground">
        <NuxtLink to="/articles" class="hover:text-foreground">文章</NuxtLink>
        <span>/</span>
        <span>{{ article.category }}</span>
      </div>
      <h1 class="text-4xl font-bold">{{ article.title }}</h1>
      <div class="flex items-center space-x-4 text-sm text-muted-foreground">
        <span>{{ article.author }}</span>
        <span>·</span>
        <span>{{ article.createdAt }}</span>
        <span>·</span>
        <span>{{ article.readingTime }} 分钟阅读</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in article.tags"
          :key="tag"
          class="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium"
        >
          {{ tag }}
        </span>
      </div>
    </header>

    <!-- Cover Image -->
    <div class="aspect-video overflow-hidden rounded-lg">
      <img
        :src="article.cover"
        :alt="article.title"
        class="h-full w-full object-cover"
      />
    </div>

    <!-- Article Content -->
    <div class="prose prose-neutral dark:prose-invert max-w-none">
      <div v-html="article.content"></div>
    </div>

    <!-- Author Info -->
    <div class="flex items-center space-x-4 rounded-lg border p-6">
      <img
        :src="article.authorAvatar"
        :alt="article.author"
        class="h-16 w-16 rounded-full"
      />
      <div>
        <h3 class="font-semibold">{{ article.author }}</h3>
        <p class="text-sm text-muted-foreground">{{ article.authorBio }}</p>
      </div>
    </div>

    <!-- Comments Section -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold">评论 ({{ comments.length }})</h2>
      
      <!-- Comment Form -->
      <form class="space-y-4" @submit.prevent="submitComment">
        <textarea
          v-model="newComment"
          rows="4"
          placeholder="写下你的评论..."
          class="w-full rounded-md border border-input bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
        ></textarea>
        <button
          type="submit"
          class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          发表评论
        </button>
      </form>

      <!-- Comments List -->
      <div class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="rounded-lg border p-4"
        >
          <div class="flex items-center space-x-3">
            <img
              :src="comment.authorAvatar"
              :alt="comment.author"
              class="h-10 w-10 rounded-full"
            />
            <div>
              <h4 class="font-medium">{{ comment.author }}</h4>
              <p class="text-xs text-muted-foreground">{{ comment.createdAt }}</p>
            </div>
          </div>
          <p class="mt-3 text-sm">{{ comment.content }}</p>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const articleId = route.params.id

useHead({
  title: '文章详情 - My Blog',
})

// Mock data
const article = ref({
  id: articleId,
  title: 'Vue 3 组合式 API 最佳实践',
  author: '张三',
  authorAvatar: 'https://picsum.photos/seed/author/100/100',
  authorBio: '全栈开发工程师，专注于前端技术和架构设计。',
  category: 'Vue.js',
  tags: ['Vue3', 'TypeScript', '组合式API'],
  cover: 'https://picsum.photos/seed/vue3/800/400',
  createdAt: '2024-01-15',
  readingTime: 10,
  content: `
    <h2>引言</h2>
    <p>Vue 3 的组合式 API（Composition API）是一个革命性的特性，它改变了我们组织和复用代码的方式。本文将深入探讨组合式 API 的设计理念和使用技巧。</p>
    
    <h2>什么是组合式 API？</h2>
    <p>组合式 API 是一组函数，允许你在 setup() 函数中组织组件逻辑。与选项式 API 不同，组合式 API 让你能够按照逻辑关注点组织代码，而不是按照选项类型。</p>
    
    <h2>核心概念</h2>
    <h3>响应式系统</h3>
    <p>Vue 3 的响应式系统基于 Proxy 实现，提供了 ref 和 reactive 两种创建响应式数据的方式。</p>
    
    <h3>生命周期钩子</h3>
    <p>在组合式 API 中，生命周期钩子以 on 开头的函数形式存在，如 onMounted、onUpdated 等。</p>
    
    <h2>最佳实践</h2>
    <p>1. 使用组合式函数（Composables）提取和复用逻辑</p>
    <p>2. 保持 setup 函数简洁，将复杂逻辑拆分到独立的组合式函数中</p>
    <p>3. 合理使用 ref 和 reactive，根据场景选择合适的响应式类型</p>
    
    <h2>总结</h2>
    <p>组合式 API 为 Vue 开发者提供了更灵活、更强大的代码组织方式。掌握这些最佳实践，将帮助你写出更优雅、更易维护的代码。</p>
  `,
})

const comments = ref([
  {
    id: 1,
    author: '李四',
    authorAvatar: 'https://picsum.photos/seed/user1/100/100',
    content: '非常棒的文章！对我理解组合式 API 有很大帮助。',
    createdAt: '2024-01-16 10:30',
  },
  {
    id: 2,
    author: '王五',
    authorAvatar: 'https://picsum.photos/seed/user2/100/100',
    content: '期待更多关于 Vue 3 的深度文章！',
    createdAt: '2024-01-16 14:20',
  },
])

const newComment = ref('')

const submitComment = () => {
  if (!newComment.value.trim()) return
  
  comments.value.push({
    id: comments.value.length + 1,
    author: '当前用户',
    authorAvatar: 'https://picsum.photos/seed/current/100/100',
    content: newComment.value,
    createdAt: new Date().toLocaleString(),
  })
  
  newComment.value = ''
}
</script>
