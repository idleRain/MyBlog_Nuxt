<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold">{{ $t('nav.articles') }}</h1>
      <p class="text-muted-foreground">
        {{ $t('articles.pagination.page', { current: totalArticles, total: '篇' }) }}
      </p>
    </div>

    <!-- Timeline -->
    <div class="space-y-12">
      <div v-for="(group, year) in articlesByYear" :key="year" class="space-y-4">
        <div class="flex items-center space-x-4">
          <h2 class="text-2xl font-bold">{{ year }}</h2>
          <div class="flex-1 border-t"></div>
          <span class="text-sm text-muted-foreground">{{ group.length }} 篇</span>
        </div>
        
        <div class="space-y-4 pl-8">
          <div
            v-for="article in group"
            :key="article.id"
            class="relative border-l-2 pb-6 pl-6 last:pb-0"
          >
            <!-- Timeline dot -->
            <div class="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-background"></div>
            
            <div class="space-y-1">
              <div class="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{{ formatDate(article.createdAt) }}</span>
                <span>·</span>
                <span>{{ article.category }}</span>
              </div>
              <NuxtLink
                :to="localePath(`/articles/${article.id}`)"
                class="text-lg font-medium hover:text-primary"
              >
                {{ article.title }}
              </NuxtLink>
              <div class="flex items-center space-x-4 text-sm text-muted-foreground">
                <span class="flex items-center space-x-1">
                  <Icon name="lucide:eye" class="h-4 w-4" />
                  <span>{{ article.viewCount }}</span>
                </span>
                <span class="flex items-center space-x-1">
                  <Icon name="lucide:message-square" class="h-4 w-4" />
                  <span>{{ article.commentCount }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="Object.keys(articlesByYear).length === 0" class="flex flex-col items-center justify-center py-12">
      <Icon name="lucide:archive" class="h-16 w-16 text-muted-foreground" />
      <p class="mt-4 text-lg text-muted-foreground">{{ $t('articles.noResults') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: t('nav.articles') + ' - ' + t('site.title'),
})

// Mock data
const articles = ref([
  { id: 1, title: 'Vue 3 组合式 API 最佳实践', createdAt: '2024-01-15', category: 'Vue.js', viewCount: 1234, commentCount: 56 },
  { id: 2, title: 'Nuxt 3 全栈开发指南', createdAt: '2024-01-10', category: 'Nuxt', viewCount: 987, commentCount: 32 },
  { id: 3, title: 'TypeScript 高级类型技巧', createdAt: '2024-01-05', category: 'TypeScript', viewCount: 654, commentCount: 18 },
  { id: 4, title: '使用 Pinia 进行状态管理', createdAt: '2024-02-20', category: 'Vue.js', viewCount: 432, commentCount: 12 },
  { id: 5, title: 'MySQL 性能优化实战', createdAt: '2024-02-18', category: '数据库', viewCount: 876, commentCount: 24 },
  { id: 6, title: 'Node.js 微服务架构设计', createdAt: '2024-03-12', category: 'Node.js', viewCount: 543, commentCount: 15 },
  { id: 7, title: 'React Hooks 深入解析', createdAt: '2023-12-20', category: 'React', viewCount: 789, commentCount: 28 },
  { id: 8, title: 'CSS Grid 布局完全指南', createdAt: '2023-11-15', category: 'CSS', viewCount: 321, commentCount: 8 },
])

const totalArticles = computed(() => articles.value.length)

const articlesByYear = computed(() => {
  const grouped: Record<string, typeof articles.value> = {}
  
  for (const article of articles.value) {
    const year = new Date(article.createdAt).getFullYear().toString()
    if (!grouped[year]) {
      grouped[year] = []
    }
    grouped[year].push(article)
  }
  
  // Sort by year descending
  const sortedYears = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a))
  const sortedGrouped: Record<string, typeof articles.value> = {}
  
  for (const year of sortedYears) {
    sortedGrouped[year] = grouped[year].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
  
  return sortedGrouped
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}-${date.getDate().toString().padStart(2, '0')}`
}
</script>
