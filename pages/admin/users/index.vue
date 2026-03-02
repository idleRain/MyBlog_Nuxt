<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="搜索用户..." class="w-[300px] pl-10" />
        </div>
        <select
          v-model="roleFilter"
          class="h-10 rounded-md border border-input bg-background px-4 text-sm"
        >
          <option value="">全部角色</option>
          <option value="admin">管理员</option>
          <option value="editor">编辑</option>
          <option value="user">用户</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <Card>
      <CardContent class="p-0">
        <table class="w-full">
          <thead class="border-b bg-muted/50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium">用户</th>
              <th class="px-4 py-3 text-left text-sm font-medium">邮箱</th>
              <th class="px-4 py-3 text-left text-sm font-medium">角色</th>
              <th class="px-4 py-3 text-left text-sm font-medium">注册时间</th>
              <th class="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-muted/50">
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <Avatar :src="user.avatar" :alt="user.nickname" />
                  <div>
                    <p class="font-medium">{{ user.nickname }}</p>
                    <p class="text-xs text-muted-foreground">@{{ user.username }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm">{{ user.email }}</td>
              <td class="px-4 py-3">
                <Badge :variant="getRoleVariant(user.role)">
                  {{ getRoleLabel(user.role) }}
                </Badge>
              </td>
              <td class="px-4 py-3 text-sm text-muted-foreground">{{ user.createdAt }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="icon" @click="editUser(user)">
                    <Icon name="lucide:pencil" class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" @click="deleteUser(user.id)">
                    <Icon name="lucide:trash-2" class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        共 {{ total }} 个用户
      </p>
      <div class="flex items-center space-x-2">
        <Button variant="outline" size="sm" :disabled="page === 1" @click="page--">
          上一页
        </Button>
        <span class="text-sm">{{ page }} / {{ totalPages }}</span>
        <Button variant="outline" size="sm" :disabled="page === totalPages" @click="page++">
          下一页
        </Button>
      </div>
    </div>

    <!-- Edit Dialog -->
    <div
      v-if="showEditDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle>编辑用户</CardTitle>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="saveUser">
            <div class="space-y-2">
              <Label for="nickname">昵称</Label>
              <Input id="nickname" v-model="form.nickname" required />
            </div>
            <div class="space-y-2">
              <Label for="role">角色</Label>
              <select
                id="role"
                v-model="form.role"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="admin">管理员</option>
                <option value="editor">编辑</option>
                <option value="user">用户</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label for="bio">简介</Label>
              <Textarea id="bio" v-model="form.bio" :rows="3" />
            </div>
            <div class="flex justify-end space-x-2">
              <Button variant="outline" type="button" @click="showEditDialog = false">
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
  title: '用户管理 - 管理后台',
})

const searchQuery = ref('')
const roleFilter = ref('')
const page = ref(1)
const totalPages = ref(3)
const total = ref(25)

const showEditDialog = ref(false)
const editingUser = ref<{ id: number } | null>(null)

const form = reactive({
  nickname: '',
  role: 'user',
  bio: '',
})

const users = ref([
  { id: 1, username: 'admin', nickname: '管理员', email: 'admin@blog.com', avatar: 'https://picsum.photos/seed/admin/100/100', role: 'admin', bio: '系统管理员', createdAt: '2023-01-01' },
  { id: 2, username: 'zhangsan', nickname: '张三', email: 'zhangsan@example.com', avatar: 'https://picsum.photos/seed/zhangsan/100/100', role: 'editor', bio: '技术编辑', createdAt: '2023-06-15' },
  { id: 3, username: 'lisi', nickname: '李四', email: 'lisi@example.com', avatar: 'https://picsum.photos/seed/lisi/100/100', role: 'user', bio: '', createdAt: '2023-08-20' },
  { id: 4, username: 'wangwu', nickname: '王五', email: 'wangwu@example.com', avatar: 'https://picsum.photos/seed/wangwu/100/100', role: 'user', bio: '', createdAt: '2023-10-05' },
  { id: 5, username: 'zhaoliu', nickname: '赵六', email: 'zhaoliu@example.com', avatar: 'https://picsum.photos/seed/zhaoliu/100/100', role: 'user', bio: '', createdAt: '2024-01-10' },
])

const filteredUsers = computed(() => {
  let result = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(u =>
      u.username.toLowerCase().includes(query) ||
      u.nickname.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    )
  }

  if (roleFilter.value) {
    result = result.filter(u => u.role === roleFilter.value)
  }

  return result
})

const getRoleVariant = (role: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    admin: 'default',
    editor: 'secondary',
    user: 'outline',
  }
  return variants[role] || 'outline'
}

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: '管理员',
    editor: '编辑',
    user: '用户',
  }
  return labels[role] || role
}

const editUser = (user: typeof users.value[0]) => {
  editingUser.value = { id: user.id }
  form.nickname = user.nickname
  form.role = user.role
  form.bio = user.bio || ''
  showEditDialog.value = true
}

const saveUser = () => {
  if (editingUser.value) {
    const user = users.value.find(u => u.id === editingUser.value!.id)
    if (user) {
      user.nickname = form.nickname
      user.role = form.role as 'admin' | 'editor' | 'user'
      user.bio = form.bio
    }
  }
  showEditDialog.value = false
  editingUser.value = null
}

const deleteUser = (id: number) => {
  if (confirm('确定要删除这个用户吗？')) {
    users.value = users.value.filter(u => u.id !== id)
  }
}
</script>
