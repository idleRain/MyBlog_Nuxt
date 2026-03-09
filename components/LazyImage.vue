<script setup lang="ts">
interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  class?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3C/svg%3E',
})

const imageRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const hasError = ref(false)

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  hasError.value = true
}

// Intersection Observer for lazy loading
onMounted(() => {
  if (!imageRef.value) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && imageRef.value) {
          imageRef.value.src = props.src
          observer.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '50px' }
  )

  observer.observe(imageRef.value)

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <div class="relative overflow-hidden" :class="props.class">
    <!-- Placeholder -->
    <div
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 animate-pulse bg-muted"
    />
    
    <!-- Image -->
    <img
      ref="imageRef"
      :src="placeholder"
      :alt="alt"
      :width="width"
      :height="height"
      class="transition-opacity duration-300"
      :class="{ 'opacity-0': !isLoaded, 'opacity-100': isLoaded }"
      loading="lazy"
      @load="handleLoad"
      @error="handleError"
    />
    
    <!-- Error state -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-muted"
    >
      <Icon name="lucide:image-off" class="h-8 w-8 text-muted-foreground" />
    </div>
  </div>
</template>
