<template>
  <div class="min-h-screen bg-muted/30">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 w-64 border-r bg-background">
      <div class="flex h-16 items-center border-b px-6">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-xl font-bold">My Blog</span>
        </NuxtLink>
      </div>
      <nav class="space-y-1 p-4">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          active-class="bg-accent text-foreground"
        >
          <Icon :name="item.icon" class="h-5 w-5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="pl-64">
      <!-- Header -->
      <header class="sticky top-0 z-40 border-b bg-background">
        <div class="flex h-16 items-center justify-between px-6">
          <h1 class="text-lg font-semibold">{{ pageTitle }}</h1>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" target="_blank" class="text-sm text-muted-foreground hover:text-foreground">
              查看网站
            </NuxtLink>
            <div class="flex items-center space-x-2">
              <Avatar :src="user?.avatar" :alt="user?.nickname" size="sm" />
              <span class="text-sm font-medium">{{ user?.nickname }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { path: '/admin', label: '仪表盘', icon: 'lucide:layout-dashboard' },
  { path: '/admin/articles', label: '文章管理', icon: 'lucide:file-text' },
  { path: '/admin/categories', label: '分类管理', icon: 'lucide:folder' },
  { path: '/admin/tags', label: '标签管理', icon: 'lucide:tags' },
  { path: '/admin/comments', label: '评论管理', icon: 'lucide:message-square' },
  { path: '/admin/users', label: '用户管理', icon: 'lucide:users' },
  { path: '/admin/settings', label: '系统设置', icon: 'lucide:settings' },
]

const pageTitles: Record<string, string> = {
  '/admin': '仪表盘',
  '/admin/articles': '文章管理',
  '/admin/categories': '分类管理',
  '/admin/tags': '标签管理',
  '/admin/comments': '评论管理',
  '/admin/users': '用户管理',
  '/admin/settings': '系统设置',
}

const pageTitle = computed(() => pageTitles[route.path] || '管理后台')

const user = computed(() => {
  if (import.meta.client) {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
  return null
})
</script>
