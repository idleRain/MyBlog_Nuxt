<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">分类管理</h2>
      <Button @click="showCreateDialog = true">
        <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
        新建分类
      </Button>
    </div>

    <!-- Categories Table -->
    <Card>
      <CardContent class="p-0">
        <table class="w-full">
          <thead class="border-b bg-muted/50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium">名称</th>
              <th class="px-4 py-3 text-left text-sm font-medium">别名</th>
              <th class="px-4 py-3 text-left text-sm font-medium">描述</th>
              <th class="px-4 py-3 text-left text-sm font-medium">文章数</th>
              <th class="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="category in categories" :key="category.id" class="hover:bg-muted/50">
              <td class="px-4 py-3 font-medium">{{ category.name }}</td>
              <td class="px-4 py-3 text-sm text-muted-foreground">{{ category.slug }}</td>
              <td class="px-4 py-3 text-sm text-muted-foreground">{{ category.description || '-' }}</td>
              <td class="px-4 py-3 text-sm">{{ category.articleCount }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="icon" @click="editCategory(category)">
                    <Icon name="lucide:pencil" class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" @click="deleteCategory(category.id)">
                    <Icon name="lucide:trash-2" class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>

    <!-- Create/Edit Dialog -->
    <div
      v-if="showCreateDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle>{{ editingCategory ? '编辑分类' : '新建分类' }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="saveCategory">
            <div class="space-y-2">
              <Label for="name">名称</Label>
              <Input id="name" v-model="form.name" required />
            </div>
            <div class="space-y-2">
              <Label for="slug">别名</Label>
              <Input id="slug" v-model="form.slug" required />
            </div>
            <div class="space-y-2">
              <Label for="description">描述</Label>
              <Textarea id="description" v-model="form.description" :rows="3" />
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
  title: '分类管理 - 管理后台',
})

const showCreateDialog = ref(false)
const editingCategory = ref<{ id: number; name: string; slug: string; description: string } | null>(null)

const form = reactive({
  name: '',
  slug: '',
  description: '',
})

const categories = ref([
  { id: 1, name: 'Vue.js', slug: 'vuejs', description: 'Vue.js 相关技术文章', articleCount: 12 },
  { id: 2, name: 'Nuxt', slug: 'nuxt', description: 'Nuxt.js 相关技术文章', articleCount: 8 },
  { id: 3, name: 'TypeScript', slug: 'typescript', description: 'TypeScript 相关技术文章', articleCount: 15 },
  { id: 4, name: 'Node.js', slug: 'nodejs', description: 'Node.js 相关技术文章', articleCount: 10 },
  { id: 5, name: '数据库', slug: 'database', description: '数据库相关技术文章', articleCount: 6 },
  { id: 6, name: 'DevOps', slug: 'devops', description: 'DevOps 相关技术文章', articleCount: 4 },
])

const editCategory = (category: { id: number; name: string; slug: string; description: string }) => {
  editingCategory.value = category
  form.name = category.name
  form.slug = category.slug
  form.description = category.description || ''
  showCreateDialog.value = true
}

const saveCategory = () => {
  if (editingCategory.value) {
    const category = categories.value.find(c => c.id === editingCategory.value!.id)
    if (category) {
      category.name = form.name
      category.slug = form.slug
      category.description = form.description
    }
  } else {
    categories.value.push({
      id: Date.now(),
      name: form.name,
      slug: form.slug,
      description: form.description,
      articleCount: 0,
    })
  }
  showCreateDialog.value = false
  editingCategory.value = null
  form.name = ''
  form.slug = ''
  form.description = ''
}

const deleteCategory = (id: number) => {
  if (confirm('确定要删除这个分类吗？')) {
    categories.value = categories.value.filter(c => c.id !== id)
  }
}
</script>
