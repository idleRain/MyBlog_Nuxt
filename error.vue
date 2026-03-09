<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary">404</h1>
      <h2 class="mt-4 text-2xl font-semibold">{{ $t('error.notFound.title') }}</h2>
      <p class="mt-2 text-muted-foreground">{{ $t('error.notFound.description') }}</p>
      <Button class="mt-8" @click="handleGoHome">
        <Icon name="lucide:home" class="mr-2 h-4 w-4" />
        {{ $t('error.goBackHome') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: `404 - ${t('site.title')}`,
})

const handleGoHome = () => {
  navigateTo(localePath('/'))
}
</script>
