<template>
  <NuxtLink
    :to="`/articles/${article.id}`"
    class="group flex items-start space-x-4 rounded-lg border p-4 transition-all hover:bg-accent"
  >
    <div class="flex-1 space-y-1">
      <div class="flex items-center space-x-2">
        <span class="text-xs font-medium text-primary">{{ article.category }}</span>
        <span class="text-xs text-muted-foreground">{{ article.createdAt }}</span>
        <span v-if="article.readingTime" class="text-xs text-muted-foreground">
          · {{ article.readingTime }} 分钟阅读
        </span>
      </div>
      <h3 class="font-semibold transition-colors group-hover:text-primary">
        {{ article.title }}
      </h3>
      <p class="line-clamp-2 text-sm text-muted-foreground">
        {{ article.summary }}
      </p>
    </div>
    <Icon name="lucide:arrow-right" class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
  </NuxtLink>
</template>

<script setup lang="ts">
interface Article {
  id: number | string
  title: string
  summary: string
  createdAt: string
  category: string
  readingTime?: number
}

defineProps<{
  article: Article
}>()
</script>
