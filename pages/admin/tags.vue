<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">标签管理</h2>
      <Button @click="showCreateDialog = true">
        <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
        新建标签
      </Button>
    </div>

    <!-- Tags Grid -->
    <div class="flex flex-wrap gap-3">
      <Card
        v-for="tag in tags"
        :key="tag.id"
        class="flex items-center space-x-3 p-3"
      >
        <div class="flex-1">
          <p class="font-medium">{{ tag.name }}</p>
          <p class="text-xs text-muted-foreground">{{ tag.articleCount }} 篇文章</p>
        </div>
        <div class="flex items-center space-x-1">
          <Button variant="ghost" size="icon" @click="editTag(tag)">
            <Icon name="lucide:pencil" class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="deleteTag(tag.id)">
            <Icon name="lucide:x" class="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </Card>
    </div>

    <!-- Create/Edit Dialog -->
    <div
      v-if="showCreateDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle>{{ editingTag ? '编辑标签' : '新建标签' }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="saveTag">
            <div class="space-y-2">
              <Label for="name">名称</Label>
              <Input id="name" v-model="form.name" required />
            </div>
            <div class="space-y-2">
              <Label for="slug">别名</Label>
              <Input id="slug" v-model="form.slug" required />
            </div>
            <div class="flex justify-end space-x-2">
              <Button variant="outline" type="button" @click="showCreateDialog = false">
                取消
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: '标签管理 - 管理后台',
})

const showCreateDialog = ref(false)
const editingTag = ref<{ id: number; name: string; slug: string } | null>(null)

const form = reactive({
  name: '',
  slug: '',
})

const tags = ref([
  { id: 1, name: 'Vue3', slug: 'vue3', articleCount: 15 },
  { id: 2, name: 'Nuxt3', slug: 'nuxt3', articleCount: 8 },
  { id: 3, name: 'TypeScript', slug: 'typescript', articleCount: 20 },
  { id: 4, name: 'JavaScript', slug: 'javascript', articleCount: 25 },
  { id: 5, name: '前端', slug: 'frontend', articleCount: 30 },
  { id: 6, name: '后端', slug: 'backend', articleCount: 18 },
  { id: 7, name: 'MySQL', slug: 'mysql', articleCount: 6 },
  { id: 8, name: 'MongoDB', slug: 'mongodb', articleCount: 4 },
])

const editTag = (tag: { id: number; name: string; slug: string }) => {
  editingTag.value = tag
  form.name = tag.name
  form.slug = tag.slug
  showCreateDialog.value = true
}

const saveTag = () => {
  if (editingTag.value) {
    const tag = tags.value.find(t => t.id === editingTag.value!.id)
    if (tag) {
      tag.name = form.name
      tag.slug = form.slug
    }
  } else {
    tags.value.push({
      id: Date.now(),
      name: form.name,
      slug: form.slug,
      articleCount: 0,
    })
  }
  showCreateDialog.value = false
  editingTag.value = null
  form.name = ''
  form.slug = ''
}

const deleteTag = (id: number) => {
  if (confirm('确定要删除这个标签吗？')) {
    tags.value = tags.value.filter(t => t.id !== id)
  }
}
</script>
