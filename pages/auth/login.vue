<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold">{{ $t('auth.login.title') }}</CardTitle>
        <CardDescription>{{ $t('auth.login.subtitle') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <Label for="email">{{ $t('auth.login.email') }}</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">{{ $t('auth.login.password') }}</Label>
            <Input
              id="password"
              v-model="form.password"
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
            <span v-else>{{ $t('auth.login.submit') }}</span>
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col space-y-4">
        <div class="text-sm text-muted-foreground">
          {{ $t('auth.login.noAccount') }}
          <NuxtLink :to="localePath('/auth/register')" class="text-primary hover:underline">
            {{ $t('auth.login.registerNow') }}
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
  title: t('auth.login.title') + ' - ' + t('site.title'),
})

definePageMeta({
  layout: false,
})

const form = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form,
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
    error.value = t('auth.error.loginFailed')
  } finally {
    loading.value = false
  }
}
</script>
