<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold">{{ $t('auth.register.title') }}</CardTitle>
        <CardDescription>{{ $t('auth.register.subtitle') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="handleRegister">
          <div class="space-y-2">
            <Label for="username">{{ $t('auth.register.username') }}</Label>
            <Input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="johndoe"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="email">{{ $t('auth.register.email') }}</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">{{ $t('auth.register.password') }}</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="confirmPassword">{{ $t('auth.register.confirmPassword') }}</Label>
            <Input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <Alert v-if="error" variant="destructive">
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>
          <Button type="submit" class="w-full" :disabled="loading">
            <span v-if="loading" class="flex items-center">
              <Icon name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
              {{ $t('common.loading') }}
            </span>
            <span v-else>{{ $t('auth.register.submit') }}</span>
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col space-y-4">
        <div class="text-sm text-muted-foreground">
          {{ $t('auth.register.hasAccount') }}
          <NuxtLink :to="localePath('/auth/login')" class="text-primary hover:underline">
            {{ $t('auth.register.loginNow') }}
          </NuxtLink>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: t('auth.register.title') + ' - ' + t('site.title'),
})

definePageMeta({
  layout: false,
})

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = t('auth.validation.passwordMismatch')
    return
  }

  if (form.password.length < 6) {
    error.value = t('auth.validation.passwordMin')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: form.username,
        email: form.email,
        password: form.password,
      },
    })

    if (response.code === 0) {
      // Store token
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Redirect to home
      navigateTo(localePath('/'))
    } else {
      error.value = response.message
    }
  } catch (e) {
    error.value = t('auth.error.registerFailed')
  } finally {
    loading.value = false
  }
}
</script>
