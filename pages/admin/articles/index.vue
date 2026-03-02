<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="搜索文章..." class="w-[300px] pl-10" />
        </div>
        <select
          v-model="statusFilter"
          class="h-10 rounded-md border border-input bg-background px-4 text-sm"
        >
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
          <option value="archived">已归档</option>
        </select>
      </div>
      <NuxtLink to="/admin/articles/create">
        <Button>
          <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
          新建文章
        </Button>
      </NuxtLink>
    </div>

    <!-- Articles Table -->
    <Card>
      <CardContent class="p-0">
        <table class="w-full">
          <thead class="border-b bg-muted/50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium">标题</th>
              <th class="px-4 py-3 text-left text-sm font-medium">分类</th>
              <th class="px-4 py-3 text-left text-sm font-medium">状态</th>
              <th class="px-4 py-3 text-left text-sm font-medium">浏览</th>
              <th class="px-4 py-3 text-left text-sm font-medium">评论</th>
              <th class="px-4 py-3 text-left text-sm font-medium">创建时间</th>
              <th class="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="article in filteredArticles" :key="article.id" class="hover:bg-muted/50">
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <img
                    v-if="article.cover"
                    :src="article.cover"
                    :alt="article.title"
                    class="h-12 w-16 rounded object-cover"
                  />
                  <div>
                    <p class="font-medium">{{ article.title }}</p>
                    <p class="text-xs text-muted-foreground line-clamp-1">{{ article.summary }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm">{{ article.category }}</td>
              <td class="px-4 py-3">
                <Badge :variant="getStatusVariant(article.status)">
                  {{ getStatusLabel(article.status) }}
                </Badge>
              </td>
              <td class="px-4 py-3 text-sm text-muted-foreground">{{ article.viewCount }}</td>
              <td class="px-4 py-3 text-sm text-muted-foreground">{{ article.commentCount }}</td>
              <td class="px-4 py-3 text-sm text-muted-foreground">{{ article.createdAt }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="icon" @click="editArticle(article.id)">
                    <Icon name="lucide:pencil" class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" @click="deleteArticle(article.id)">
                    <Icon name="lucide:trash-2" class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        共 {{ total }} 篇文章
      </p>
      <div class="flex items-center space-x-2">
        <Button variant="outline" size="sm" :disabled="page === 1" @click="page--">
          上一页
        </Button>
        <span class="text-sm">{{ page }} / {{ totalPages }}</span>
        <Button variant="outline" size="sm" :disabled="page === totalPages" @click="page++">
          下一页
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: '文章管理 - 管理后台',
})

const searchQuery = ref('')
const statusFilter = ref('')
const page = ref(1)
const totalPages = ref(5)
const total = ref(48)

const articles = ref([
  { id: 1, title: 'Vue 3 组合式 API 最佳实践', summary: '深入探讨 Vue 3 组合式 API 的设计理念...', cover: 'https://picsum.photos/seed/vue3/100/75', category: 'Vue.js', status: 'published', viewCount: 1234, commentCount: 56, createdAt: '2024-01-15' },
  { id: 2, title: 'Nuxt 3 全栈开发指南', summary: '从零开始学习 Nuxt 3...', cover: 'https://picsum.photos/seed/nuxt3/100/75', category: 'Nuxt', status: 'published', viewCount: 987, commentCount: 32, createdAt: '2024-01-10' },
  { id: 3, title: 'TypeScript 高级类型技巧', summary: '掌握 TypeScript 的高级类型系统...', cover: 'https://picsum.photos/seed/ts/100/75', category: 'TypeScript', status: 'draft', viewCount: 0, commentCount: 0, createdAt: '2024-01-05' },
  { id: 4, title: '使用 Pinia 进行状态管理', summary: 'Pinia 是 Vue 3 的官方推荐状态管理库...', cover: 'https://picsum.photos/seed/pinia/100/75', category: 'Vue.js', status: 'published', viewCount: 654, commentCount: 18, createdAt: '2024-01-20' },
  { id: 5, title: 'MySQL 性能优化实战', summary: '从索引设计到查询优化...', cover: 'https://picsum.photos/seed/mysql/100/75', category: '数据库', status: 'archived', viewCount: 432, commentCount: 12, createdAt: '2024-01-18' },
])

const filteredArticles = computed(() => {
  let result = articles.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a => a.title.toLowerCase().includes(query))
  }

  if (statusFilter.value) {
    result = result.filter(a => a.status === statusFilter.value)
  }

  return result
})

const getStatusVariant = (status: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    published: 'default',
    draft: 'secondary',
    archived: 'outline',
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档',
  }
  return labels[status] || status
}

const editArticle = (id: number) => {
  navigateTo(`/admin/articles/${id}/edit`)
}

const deleteArticle = async (id: number) => {
  if (confirm('确定要删除这篇文章吗？')) {
    // Call API to delete
    articles.value = articles.value.filter(a => a.id !== id)
  }
}
</script>
