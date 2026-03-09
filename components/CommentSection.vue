<script setup lang="ts">
interface Comment {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  likes: number
  replies?: Comment[]
}

const props = defineProps<{
  articleId: string
}>()

const { t } = useI18n()

const comments = ref<Comment[]>([
  {
    id: '1',
    content: '这篇文章写得很好，对我帮助很大！',
    author: {
      name: '李四',
      avatar: 'https://picsum.photos/seed/user1/40/40',
    },
    createdAt: '2024-01-16',
    likes: 12,
    replies: [
      {
        id: '1-1',
        content: '谢谢支持！',
        author: {
          name: '张三',
          avatar: 'https://picsum.photos/seed/author/40/40',
        },
        createdAt: '2024-01-16',
        likes: 5,
      },
    ],
  },
  {
    id: '2',
    content: '请问有完整的代码示例吗？',
    author: {
      name: '王五',
      avatar: 'https://picsum.photos/seed/user2/40/40',
    },
    createdAt: '2024-01-17',
    likes: 8,
  },
])

const newComment = ref('')
const replyTo = ref<string | null>(null)
const replyContent = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!newComment.value.trim()) return
  
  isSubmitting.value = true
  // TODO: Submit comment to API
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  comments.value.unshift({
    id: Date.now().toString(),
    content: newComment.value,
    author: {
      name: '当前用户',
      avatar: 'https://picsum.photos/seed/current/40/40',
    },
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0,
  })
  
  newComment.value = ''
  isSubmitting.value = false
}

const handleReply = async (commentId: string) => {
  if (!replyContent.value.trim()) return
  
  // TODO: Submit reply to API
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    if (!comment.replies) comment.replies = []
    comment.replies.push({
      id: `${commentId}-${Date.now()}`,
      content: replyContent.value,
      author: {
        name: '当前用户',
        avatar: 'https://picsum.photos/seed/current/40/40',
      },
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
    })
  }
  
  replyContent.value = ''
  replyTo.value = null
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Comment Form -->
    <div class="space-y-3">
      <textarea
        v-model="newComment"
        :placeholder="$t('comment.placeholder')"
        class="min-h-[100px] w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        rows="3"
      />
      <div class="flex justify-end">
        <Button
          :disabled="!newComment.trim() || isSubmitting"
          @click="handleSubmit"
        >
          <Icon v-if="isSubmitting" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          {{ $t('comment.submit') }}
        </Button>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="comments.length > 0" class="space-y-6">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="space-y-3 rounded-lg border p-4"
      >
        <!-- Comment -->
        <div class="flex gap-3">
          <img
            :src="comment.author.avatar"
            :alt="comment.author.name"
            class="h-10 w-10 rounded-full"
          />
          <div class="flex-1 space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ comment.author.name }}</span>
              <span class="text-xs text-muted-foreground">
                {{ formatDate(comment.createdAt) }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground">{{ comment.content }}</p>
            <div class="flex items-center gap-4 pt-1">
              <button class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <Icon name="lucide:heart" class="h-4 w-4" />
                <span>{{ comment.likes }}</span>
              </button>
              <button
                class="text-xs text-muted-foreground hover:text-foreground"
                @click="replyTo = replyTo === comment.id ? null : comment.id"
              >
                {{ $t('comment.reply') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Reply Form -->
        <div v-if="replyTo === comment.id" class="ml-12 space-y-2">
          <textarea
            v-model="replyContent"
            :placeholder="$t('comment.placeholder')"
            class="min-h-[80px] w-full rounded-lg border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            rows="2"
          />
          <div class="flex gap-2">
            <Button size="sm" @click="handleReply(comment.id)">
              {{ $t('comment.submit') }}
            </Button>
            <Button size="sm" variant="ghost" @click="replyTo = null">
              {{ $t('comment.cancel') }}
            </Button>
          </div>
        </div>

        <!-- Replies -->
        <div v-if="comment.replies && comment.replies.length > 0" class="ml-12 space-y-3 border-l-2 pl-4">
          <div
            v-for="reply in comment.replies"
            :key="reply.id"
            class="flex gap-3"
          >
            <img
              :src="reply.author.avatar"
              :alt="reply.author.name"
              class="h-8 w-8 rounded-full"
            />
            <div class="flex-1 space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">{{ reply.author.name }}</span>
                <span class="text-xs text-muted-foreground">
                  {{ formatDate(reply.createdAt) }}
                </span>
              </div>
              <p class="text-sm text-muted-foreground">{{ reply.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <Icon name="lucide:message-square-off" class="h-12 w-12 text-muted-foreground" />
      <p class="mt-4 text-muted-foreground">{{ $t('comment.noComments') }}</p>
    </div>
  </div>
</template>
