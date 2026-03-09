<script setup lang="ts">
const isVisible = ref(false)

const checkVisibility = () => {
  isVisible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', checkVisibility, { passive: true })
  checkVisibility()

  onUnmounted(() => {
    window.removeEventListener('scroll', checkVisibility)
  })
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <button
      v-if="isVisible"
      class="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <Icon name="lucide:arrow-up" class="h-5 w-5" />
    </button>
  </Transition>
</template>
