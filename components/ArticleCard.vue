<template>
  <NuxtLink
    :to="`/articles/${article.id}`"
    class="group block overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
  >
    <div class="aspect-video overflow-hidden">
      <img
        :src="article.cover"
        :alt="article.title"
        class="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
    </div>
    <div class="p-4">
      <div class="mb-2 flex items-center space-x-2">
        <span class="text-xs font-medium text-primary">{{ article.category }}</span>
        <span class="text-xs text-muted-foreground">{{ article.createdAt }}</span>
      </div>
      <h3 class="mb-2 font-semibold transition-colors group-hover:text-primary">
        {{ article.title }}
      </h3>
      <p class="line-clamp-2 text-sm text-muted-foreground">
        {{ article.summary }}
      </p>
      <div class="mt-3 flex flex-wrap gap-1">
        <span
          v-for="tag in article.tags"
          :key="tag"
          class="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Article {
  id: number | string
  title: string
  summary: string
  cover: string
  createdAt: string
  category: string
  tags: string[]
}

defineProps<{
  article: Article
}>()
</script>
