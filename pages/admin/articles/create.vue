<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/admin/articles" class="text-muted-foreground hover:text-foreground">
          <Icon name="lucide:arrow-left" class="h-5 w-5" />
        </NuxtLink>
        <h2 class="text-xl font-semibold">{{ isEdit ? '编辑文章' : '新建文章' }}</h2>
      </div>
      <div class="flex items-center space-x-3">
        <Button variant="outline" @click="saveDraft">
          保存草稿
        </Button>
        <Button @click="publish">
          发布文章
        </Button>
      </div>
    </div>

    <!-- Editor -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Main Editor -->
      <div class="space-y-4 lg:col-span-2">
        <!-- Title -->
        <div>
          <Input
            v-model="form.title"
            placeholder="文章标题"
            class="text-xl font-semibold"
          />
        </div>

        <!-- Markdown Editor -->
        <div class="overflow-hidden rounded-lg border">
          <!-- Toolbar -->
          <div class="flex items-center space-x-1 border-b bg-muted/50 p-2">
            <Button variant="ghost" size="sm" @click="insertMarkdown('**', '**')">
              <Icon name="lucide:bold" class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" @click="insertMarkdown('*', '*')">
              <Icon name="lucide:italic" class="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" class="mx-2 h-6" />
            <Button variant="ghost" size="sm" @click="insertMarkdown('# ', '')">
              H1
            </Button>
            <Button variant="ghost" size="sm" @click="insertMarkdown('## ', '')">
              H2
            </Button>
            <Button variant="ghost" size="sm" @click="insertMarkdown('### ', '')">
              H3
            </Button>
            <Separator orientation="vertical" class="mx-2 h-6" />
            <Button variant="ghost" size="sm" @click="insertMarkdown('- ', '')">
              <Icon name="lucide:list" class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" @click="insertMarkdown('1. ', '')">
              <Icon name="lucide:list-ordered" class="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" class="mx-2 h-6" />
            <Button variant="ghost" size="sm" @click="insertMarkdown('[', '](url)')">
              <Icon name="lucide:link" class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" @click="insertMarkdown('![alt](', ')')">
              <Icon name="lucide:image" class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" @click="insertMarkdown('```\n', '\n```')">
              <Icon name="lucide:code" class="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" class="mx-2 h-6" />
            <Button variant="ghost" size="sm" @click="togglePreview">
              <Icon name="lucide:eye" class="h-4 w-4 mr-1" />
              {{ showPreview ? '隐藏预览' : '预览' }}
            </Button>
          </div>

          <!-- Editor Area -->
          <div class="grid" :class="showPreview ? 'grid-cols-2' : 'grid-cols-1'">
            <textarea
              ref="editorRef"
              v-model="form.content"
              class="min-h-[500px] w-full resize-none border-0 bg-transparent p-4 font-mono text-sm focus:outline-none focus:ring-0"
              placeholder="使用 Markdown 编写文章内容..."
            ></textarea>
            <div
              v-if="showPreview"
              class="prose prose-sm dark:prose-invert max-w-none border-l p-4"
              v-html="renderedContent"
            ></div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Summary -->
        <Card>
          <CardHeader>
            <CardTitle class="text-sm">摘要</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              v-model="form.summary"
              placeholder="文章摘要..."
              :rows="4"
            />
          </CardContent>
        </Card>

        <!-- Cover -->
        <Card>
          <CardHeader>
            <CardTitle class="text-sm">封面图片</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              v-if="!form.cover"
              class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 hover:border-primary cursor-pointer"
              @click="uploadCover"
            >
              <Icon name="lucide:upload" class="h-8 w-8 text-muted-foreground" />
              <p class="mt-2 text-sm text-muted-foreground">点击上传封面</p>
            </div>
            <div v-else class="relative">
              <img :src="form.cover" alt="Cover" class="w-full rounded-lg" />
              <Button
                variant="destructive"
                size="icon"
                class="absolute right-2 top-2"
                @click="form.cover = ''"
              >
                <Icon name="lucide:x" class="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Category -->
        <Card>
          <CardHeader>
            <CardTitle class="text-sm">分类</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              v-model="form.categoryId"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </CardContent>
        </Card>

        <!-- Tags -->
        <Card>
          <CardHeader>
            <CardTitle class="text-sm">标签</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="tag in form.tags"
                :key="tag"
                variant="secondary"
                class="cursor-pointer"
                @click="removeTag(tag)"
              >
                {{ tag }}
                <Icon name="lucide:x" class="ml-1 h-3 w-3" />
              </Badge>
            </div>
            <div class="mt-3 flex">
              <Input
                v-model="newTag"
                placeholder="添加标签"
                class="flex-1"
                @keyup.enter="addTag"
              />
              <Button variant="outline" size="icon" class="ml-2" @click="addTag">
                <Icon name="lucide:plus" class="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import DOMPurify from 'dompurify'

definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const isEdit = computed(() => !!route.params.id)

useHead({
  title: isEdit.value ? '编辑文章 - 管理后台' : '新建文章 - 管理后台',
})

const editorRef = ref<HTMLTextAreaElement | null>(null)
const showPreview = ref(false)
const newTag = ref('')

const form = reactive({
  title: '',
  content: '',
  summary: '',
  cover: '',
  categoryId: '',
  tags: [] as string[],
  status: 'draft' as 'draft' | 'published',
})

const categories = ref([
  { id: 1, name: 'Vue.js' },
  { id: 2, name: 'Nuxt' },
  { id: 3, name: 'TypeScript' },
  { id: 4, name: 'Node.js' },
  { id: 5, name: '数据库' },
])

const renderedContent = computed(() => {
  if (!form.content) return ''
  const rawHtml = marked(form.content) as string
  return DOMPurify.sanitize(rawHtml)
})

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const insertMarkdown = (before: string, after: string) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.content.substring(start, end)
  const replacement = before + selectedText + after

  form.content = form.content.substring(0, start) + replacement + form.content.substring(end)

  // Reset cursor position
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
  })
}

const addTag = () => {
  if (newTag.value.trim() && !form.tags.includes(newTag.value.trim())) {
    form.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (tag: string) => {
  form.tags = form.tags.filter(t => t !== tag)
}

const uploadCover = () => {
  // Mock upload
  form.cover = `https://picsum.photos/seed/${Date.now()}/800/400`
}

const saveDraft = async () => {
  form.status = 'draft'
  // Call API to save
  alert('草稿已保存')
}

const publish = async () => {
  if (!form.title || !form.content) {
    alert('请填写标题和内容')
    return
  }
  form.status = 'published'
  // Call API to publish
  alert('文章已发布')
  navigateTo('/admin/articles')
}

// Load article data if editing
if (isEdit.value) {
  // Mock data
  form.title = 'Vue 3 组合式 API 最佳实践'
  form.content = `# Vue 3 组合式 API 最佳实践

## 引言

Vue 3 的组合式 API（Composition API）是一个革命性的特性...

## 核心概念

### 响应式系统

\`\`\`typescript
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({ name: 'Vue' })
\`\`\`

## 总结

组合式 API 为 Vue 开发者提供了更灵活的代码组织方式。`
  form.summary = '深入探讨 Vue 3 组合式 API 的设计理念和使用技巧'
  form.cover = 'https://picsum.photos/seed/vue3/800/400'
  form.categoryId = '1'
  form.tags = ['Vue3', 'TypeScript']
}
</script>
