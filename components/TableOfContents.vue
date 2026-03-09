<script setup lang="ts">
interface TocItem {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  content: string
}>()

const { t } = useI18n()
const activeId = shallowRef('')
const tocItems = shallowRef<TocItem[]>([])

// Parse headings from content
const parseHeadings = (html: string): TocItem[] => {
  const headings: TocItem[] = []
  const regex = /<h([2-4])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h\1>/g
  let match

  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''),
    })
  }

  return headings
}

// Scroll to heading
const { scrollToElement } = useScroll()

const handleHeadingClick = (id: string) => {
  scrollToElement(`#${id}`, 100)
}

// Intersection observer for active heading
const { observe, disconnect } = useIntersectionObserver({
  rootMargin: '-80px 0px -80% 0px',
})

onMounted(() => {
  // Parse headings
  tocItems.value = parseHeadings(props.content)

  // Observe all headings
  nextTick(() => {
    tocItems.value.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        // Create a new observer for each heading
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                activeId.value = item.id
              }
            })
          },
          { rootMargin: '-80px 0px -80% 0px' }
        )
        observer.observe(element)
      }
    })
  })
})

onUnmounted(() => {
  disconnect()
})
</script>

<template>
  <div v-if="tocItems.length > 0" class="space-y-3">
    <h4 class="text-sm font-semibold">{{ $t('article.tableOfContents') }}</h4>
    <nav class="space-y-1">
      <button
        v-for="item in tocItems"
        :key="item.id"
        class="block w-full truncate rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
        :class="[
          activeId === item.id ? 'bg-accent text-primary font-medium' : 'text-muted-foreground',
          item.level === 2 ? 'pl-2' : '',
          item.level === 3 ? 'pl-4' : '',
          item.level === 4 ? 'pl-6' : '',
        ]"
        @click="handleHeadingClick(item.id)"
      >
        {{ item.text }}
      </button>
    </nav>
  </div>
</template>
