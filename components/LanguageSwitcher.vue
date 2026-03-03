<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLocale = computed(() => locale.value)

const availableLocales = computed(() => {
  return locales.value.filter((l) => typeof l === 'object' && l.code !== currentLocale.value)
})

const switchLocale = (code: string) => {
  setLocale(code)
}
</script>

<template>
  <div class="relative">
    <button
      class="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
      :title="$t('language.switch')"
    >
      <Icon name="lucide:globe" class="h-5 w-5" />
    </button>
    
    <!-- Dropdown -->
    <div class="absolute right-0 top-full z-50 mt-2 w-32 rounded-md border bg-background shadow-lg">
      <button
        v-for="loc in locales"
        :key="(loc as { code: string }).code"
        class="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-accent"
        :class="{ 'bg-accent': (loc as { code: string }).code === currentLocale }"
        @click="switchLocale((loc as { code: string }).code)"
      >
        <span>{{ (loc as { name: string }).name }}</span>
        <Icon
          v-if="(loc as { code: string }).code === currentLocale"
          name="lucide:check"
          class="h-4 w-4"
        />
      </button>
    </div>
  </div>
</template>
