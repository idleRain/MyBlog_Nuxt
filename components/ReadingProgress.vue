<script setup lang="ts">
const { progress } = useReadingProgress()
</script>

<template>
  <div
    class="fixed left-0 top-0 z-[100] h-1 bg-primary transition-all duration-150"
    :style="{ width: `${progress}%` }"
  />
</template>
