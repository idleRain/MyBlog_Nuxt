<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="flex flex-col items-center space-y-6 py-12 text-center">
      <img
        src="https://picsum.photos/seed/profile/200/200"
        alt="Profile"
        class="h-32 w-32 rounded-full"
      />
      <h1 class="text-4xl font-bold">{{ $t('about.title') }}</h1>
      <p class="max-w-2xl text-lg text-muted-foreground">
        {{ $t('about.bio') }}
      </p>
    </section>

    <!-- Skills Section -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold">{{ $t('about.skills') }}</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="skill in skills"
          :key="skill.name"
          class="rounded-lg border p-6"
        >
          <div class="flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon :name="skill.icon" class="h-5 w-5 text-primary" />
            </div>
            <h3 class="font-semibold">{{ skill.name }}</h3>
          </div>
          <p class="mt-3 text-sm text-muted-foreground">{{ skill.description }}</p>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold">{{ $t('about.experience') }}</h2>
      <div class="space-y-6">
        <div
          v-for="experience in experiences"
          :key="experience.company"
          class="rounded-lg border p-6"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-semibold">{{ experience.position }}</h3>
              <p class="text-muted-foreground">{{ experience.company }}</p>
            </div>
            <span class="text-sm text-muted-foreground">{{ experience.period }}</span>
          </div>
          <p class="mt-3 text-sm text-muted-foreground">{{ experience.description }}</p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold">{{ $t('about.contact') }}</h2>
      <div class="flex flex-wrap gap-4">
        <a
          v-for="contact in contacts"
          :key="contact.name"
          :href="contact.link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors hover:bg-accent"
        >
          <Icon :name="contact.icon" class="h-5 w-5" />
          <span>{{ contact.name }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('nav.about') + ' - ' + t('site.title'),
})

const skills = ref([
  {
    name: 'Vue.js / Nuxt',
    icon: 'lucide:code-2',
    description: '精通 Vue 3 生态系统，熟练使用组合式 API、Pinia、Vue Router 等核心库。',
  },
  {
    name: 'TypeScript',
    icon: 'lucide:file-code',
    description: '深入理解 TypeScript 类型系统，能够编写类型安全的代码。',
  },
  {
    name: 'Node.js',
    icon: 'lucide:server',
    description: '熟悉 Node.js 后端开发，有 Express、NestJS 等框架使用经验。',
  },
  {
    name: '数据库',
    icon: 'lucide:database',
    description: '熟练使用 MySQL、MongoDB 等数据库，了解数据库设计和优化。',
  },
  {
    name: 'DevOps',
    icon: 'lucide:git-branch',
    description: '熟悉 Git 工作流、Docker 容器化、CI/CD 流程等。',
  },
  {
    name: '前端工程化',
    icon: 'lucide:settings',
    description: '熟悉 Webpack、Vite 等构建工具，有前端工程化实践经验。',
  },
])

const experiences = ref([
  {
    company: '某科技公司',
    position: '高级前端工程师',
    period: '2022 - 至今',
    description: '负责公司核心产品的前端架构设计和开发，带领团队完成多个重要项目。',
  },
  {
    company: '某互联网公司',
    position: '前端工程师',
    period: '2020 - 2022',
    description: '参与公司电商平台的前端开发，优化用户体验和页面性能。',
  },
])

const contacts = ref([
  { name: 'GitHub', icon: 'lucide:github', link: 'https://github.com' },
  { name: 'Twitter', icon: 'lucide:twitter', link: 'https://twitter.com' },
  { name: '邮箱', icon: 'lucide:mail', link: 'mailto:example@email.com' },
])
</script>
