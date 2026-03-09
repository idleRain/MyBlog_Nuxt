<script setup lang="ts">
const readingProgress = ref(0)

onMounted(() => {
  const updateProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
    readingProgress.value = Math.min(100, Math.max(0, progress))
  }

  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()

  onUnmounted(() => {
    window.removeEventListener('scroll', updateProgress)
  })
})
</script>

<template>
  <div
    class="fixed left-0 top-0 z-[100] h-1 bg-primary transition-all duration-150"
    :style="{ width: `${readingProgress}%` }"
  />
</template>
