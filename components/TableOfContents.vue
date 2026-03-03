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
const activeId = ref('')
const tocItems = ref<TocItem[]>([])

// Parse headings from content
const parseHeadings = (html: string) => {
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

// Generate ID from text
const generateId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
}

onMounted(() => {
  // Parse headings
  tocItems.value = parseHeadings(props.content)

  // Observe headings for active state
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    { rootMargin: '-80px 0px -80% 0px' }
  )

  // Observe all headings
  nextTick(() => {
    tocItems.value.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })
  })

  onUnmounted(() => {
    observer.disconnect()
  })
})

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100
    const top = element.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
</script>

<template>
  <div v-if="tocItems.length > 0" class="space-y-3">
    <h4 class="text-sm font-semibold">{{ $t('article.tableOfContents') }}</h4>
    <nav class="space-y-1">
      <button
        v-for="item in tocItems"
        :key="item.id"
        class="block w-full truncate rounded px-2 py-1 text-left text-sm transition-colors hover:bg-accent"
        :class="[
          activeId === item.id ? 'bg-accent text-primary' : 'text-muted-foreground',
          item.level === 2 ? 'pl-2' : '',
          item.level === 3 ? 'pl-4' : '',
          item.level === 4 ? 'pl-6' : '',
        ]"
        @click="scrollToHeading(item.id)"
      >
        {{ item.text }}
      </button>
    </nav>
  </div>
</template>
