<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Props {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
}
</script>

<template>
  <div
    :class="cn(
      'relative flex shrink-0 overflow-hidden rounded-full',
      sizeClasses[size],
      props.class
    )"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="aspect-square h-full w-full object-cover"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center bg-muted text-muted-foreground"
    >
      <Icon name="lucide:user" class="h-1/2 w-1/2" />
    </div>
  </div>
</template>
