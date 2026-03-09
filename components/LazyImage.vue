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

const imageRef = shallowRef<HTMLImageElement>()
const isLoaded = shallowRef(false)
const hasError = shallowRef(false)

const { observe, isIntersecting } = useIntersectionObserver({
  rootMargin: '50px',
  once: true,
})

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  hasError.value = true
}

// Observe image element
watchEffect(() => {
  if (imageRef.value) {
    observe(imageRef.value)
  }
})

// Load image when intersecting
const imageSrc = computed(() => {
  if (!isIntersecting.value) return props.placeholder
  return props.src
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
      :src="imageSrc"
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
