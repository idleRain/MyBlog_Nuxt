<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">文章总数</CardTitle>
          <Icon name="lucide:file-text" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.articleCount }}</div>
          <p class="text-xs text-muted-foreground">
            较上月 +{{ stats.articleGrowth }}%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">总访问量</CardTitle>
          <Icon name="lucide:eye" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.viewCount }}</div>
          <p class="text-xs text-muted-foreground">
            较上月 +{{ stats.viewGrowth }}%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">评论数</CardTitle>
          <Icon name="lucide:message-square" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.commentCount }}</div>
          <p class="text-xs text-muted-foreground">
            较上月 +{{ stats.commentGrowth }}%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">用户数</CardTitle>
          <Icon name="lucide:users" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.userCount }}</div>
          <p class="text-xs text-muted-foreground">
            较上月 +{{ stats.userGrowth }}%
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Articles -->
    <div class="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>最新文章</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="article in recentArticles"
              :key="article.id"
              class="flex items-center justify-between"
            >
              <div class="space-y-1">
                <p class="text-sm font-medium leading-none">{{ article.title }}</p>
                <p class="text-xs text-muted-foreground">{{ article.createdAt }}</p>
              </div>
              <Badge :variant="article.status === 'published' ? 'default' : 'secondary'">
                {{ article.status === 'published' ? '已发布' : '草稿' }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>最新评论</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="comment in recentComments"
              :key="comment.id"
              class="flex items-start space-x-3"
            >
              <Avatar :src="comment.authorAvatar" :alt="comment.author" size="sm" />
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium leading-none">{{ comment.author }}</p>
                <p class="text-xs text-muted-foreground line-clamp-2">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: '仪表盘 - 管理后台',
})

// Mock data
const stats = ref({
  articleCount: 128,
  articleGrowth: 12,
  viewCount: 24589,
  viewGrowth: 18,
  commentCount: 356,
  commentGrowth: 8,
  userCount: 1024,
  userGrowth: 5,
})

const recentArticles = ref([
  { id: 1, title: 'Vue 3 组合式 API 最佳实践', createdAt: '2024-01-15', status: 'published' },
  { id: 2, title: 'Nuxt 3 全栈开发指南', createdAt: '2024-01-10', status: 'published' },
  { id: 3, title: 'TypeScript 高级类型技巧', createdAt: '2024-01-05', status: 'draft' },
  { id: 4, title: '使用 Pinia 进行状态管理', createdAt: '2024-01-20', status: 'published' },
])

const recentComments = ref([
  { id: 1, author: '李四', authorAvatar: 'https://picsum.photos/seed/user1/100/100', content: '非常棒的文章！对我理解组合式 API 有很大帮助。' },
  { id: 2, author: '王五', authorAvatar: 'https://picsum.photos/seed/user2/100/100', content: '期待更多关于 Vue 3 的深度文章！' },
  { id: 3, author: '赵六', authorAvatar: 'https://picsum.photos/seed/user3/100/100', content: '代码示例很清晰，感谢分享！' },
])
</script>
