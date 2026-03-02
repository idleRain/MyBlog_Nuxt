<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <select
          v-model="statusFilter"
          class="h-10 rounded-md border border-input bg-background px-4 text-sm"
        >
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
          <option value="spam">垃圾评论</option>
        </select>
      </div>
    </div>

    <!-- Comments List -->
    <div class="space-y-4">
      <Card v-for="comment in filteredComments" :key="comment.id">
        <CardContent class="p-4">
          <div class="flex items-start space-x-4">
            <Avatar :src="comment.user.avatar" :alt="comment.user.nickname" />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="font-medium">{{ comment.user.nickname }}</span>
                  <Badge :variant="getStatusVariant(comment.status)">
                    {{ getStatusLabel(comment.status) }}
                  </Badge>
                </div>
                <span class="text-xs text-muted-foreground">{{ comment.createdAt }}</span>
              </div>
              <p class="mt-2 text-sm">{{ comment.content }}</p>
              <div class="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
                <span>文章：</span>
                <NuxtLink :to="`/articles/${comment.article.id}`" class="text-primary hover:underline">
                  {{ comment.article.title }}
                </NuxtLink>
              </div>
              <div class="mt-3 flex items-center space-x-2">
                <Button
                  v-if="comment.status !== 'approved'"
                  variant="outline"
                  size="sm"
                  @click="updateStatus(comment.id, 'approved')"
                >
                  通过
                </Button>
                <Button
                  v-if="comment.status !== 'rejected'"
                  variant="outline"
                  size="sm"
                  @click="updateStatus(comment.id, 'rejected')"
                >
                  拒绝
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  @click="updateStatus(comment.id, 'spam')"
                >
                  标记为垃圾
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  @click="deleteComment(comment.id)"
                >
                  删除
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-if="filteredComments.length === 0" class="flex flex-col items-center justify-center py-12">
      <Icon name="lucide:message-square-off" class="h-12 w-12 text-muted-foreground" />
      <p class="mt-4 text-lg text-muted-foreground">暂无评论</p>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        共 {{ total }} 条评论
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
  title: '评论管理 - 管理后台',
})

const statusFilter = ref('')
const page = ref(1)
const totalPages = ref(3)
const total = ref(28)

const comments = ref([
  {
    id: 1,
    content: '非常棒的文章！对我理解组合式 API 有很大帮助。',
    status: 'approved',
    createdAt: '2024-01-16 10:30',
    article: { id: 1, title: 'Vue 3 组合式 API 最佳实践' },
    user: { id: 1, nickname: '李四', avatar: 'https://picsum.photos/seed/user1/100/100' },
  },
  {
    id: 2,
    content: '期待更多关于 Vue 3 的深度文章！',
    status: 'pending',
    createdAt: '2024-01-16 14:20',
    article: { id: 1, title: 'Vue 3 组合式 API 最佳实践' },
    user: { id: 2, nickname: '王五', avatar: 'https://picsum.photos/seed/user2/100/100' },
  },
  {
    id: 3,
    content: '代码示例很清晰，感谢分享！',
    status: 'approved',
    createdAt: '2024-01-17 09:15',
    article: { id: 2, title: 'Nuxt 3 全栈开发指南' },
    user: { id: 3, nickname: '赵六', avatar: 'https://picsum.photos/seed/user3/100/100' },
  },
  {
    id: 4,
    content: '这是一条垃圾评论...',
    status: 'spam',
    createdAt: '2024-01-17 16:45',
    article: { id: 3, title: 'TypeScript 高级类型技巧' },
    user: { id: 4, nickname: '广告用户', avatar: 'https://picsum.photos/seed/spam/100/100' },
  },
])

const filteredComments = computed(() => {
  if (!statusFilter.value) return comments.value
  return comments.value.filter(c => c.status === statusFilter.value)
})

const getStatusVariant = (status: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    approved: 'default',
    pending: 'secondary',
    rejected: 'outline',
    spam: 'destructive',
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    approved: '已通过',
    pending: '待审核',
    rejected: '已拒绝',
    spam: '垃圾',
  }
  return labels[status] || status
}

const updateStatus = async (id: number, status: string) => {
  const comment = comments.value.find(c => c.id === id)
  if (comment) {
    comment.status = status as 'pending' | 'approved' | 'rejected' | 'spam'
  }
}

const deleteComment = async (id: number) => {
  if (confirm('确定要删除这条评论吗？')) {
    comments.value = comments.value.filter(c => c.id !== id)
  }
}
</script>
