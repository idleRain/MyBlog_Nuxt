<script setup lang="ts">
import hljs from 'highlight.js'
import { onMounted, watch } from 'vue'

const props = defineProps<{
  code: string
  language?: string
  showLineNumbers?: boolean
}>()

const { t } = useI18n()
const highlightedCode = ref('')

const highlight = () => {
  if (!props.code) return

  let result: string

  if (props.language && hljs.getLanguage(props.language)) {
    result = hljs.highlight(props.code, { language: props.language }).value
  } else {
    result = hljs.highlightAuto(props.code).value
  }

  if (props.showLineNumbers) {
    const lines = result.split('\n')
    const numberedLines = lines.map((line, index) => {
      return `<span class="line"><span class="line-number">${index + 1}</span>${line}</span>`
    })
    highlightedCode.value = numberedLines.join('\n')
  } else {
    highlightedCode.value = result
  }
}

onMounted(() => {
  highlight()
})

watch(() => props.code, highlight)
</script>

<template>
  <div class="relative group">
    <pre
      class="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm dark:bg-zinc-950"
      :class="{ 'line-numbers': showLineNumbers }"
    ><code
        class="hljs"
        v-html="highlightedCode"
      /></pre>
    <button
      class="absolute right-2 top-2 rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100"
      @click="() => navigator.clipboard.writeText(code)"
    >
      {{ t('common.copy') || 'Copy' }}
    </button>
  </div>
</template>

<style>
/* Light theme code highlighting */
.hljs {
  color: #383a42;
  background: transparent;
}

.hljs-comment,
.hljs-quote {
  color: #a0a1a7;
  font-style: italic;
}

.hljs-doctag,
.hljs-keyword,
.hljs-formula {
  color: #a626a4;
}

.hljs-section,
.hljs-name,
.hljs-selector-tag,
.hljs-deletion,
.hljs-subst {
  color: #e45649;
}

.hljs-literal {
  color: #0184bb;
}

.hljs-string,
.hljs-regexp,
.hljs-addition,
.hljs-attribute,
.hljs-meta .hljs-string {
  color: #50a14f;
}

.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-type,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-number {
  color: #986801;
}

.hljs-symbol,
.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-title {
  color: #4078f2;
}

.hljs-built_in,
.hljs-title.class_,
.hljs-class .hljs-title {
  color: #c18401;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

.hljs-link {
  text-decoration: underline;
}

.line-numbers .line {
  display: block;
}

.line-numbers .line-number {
  display: inline-block;
  width: 2rem;
  margin-right: 1rem;
  color: #636d83;
  text-align: right;
  user-select: none;
}

/* Dark theme code highlighting */
.dark .hljs {
  color: #abb2bf;
  background: transparent;
}

.dark .hljs-comment,
.dark .hljs-quote {
  color: #5c6370;
  font-style: italic;
}

.dark .hljs-doctag,
.dark .hljs-keyword,
.dark .hljs-formula {
  color: #c678dd;
}

.dark .hljs-section,
.dark .hljs-name,
.dark .hljs-selector-tag,
.dark .hljs-deletion,
.dark .hljs-subst {
  color: #e06c75;
}

.dark .hljs-literal {
  color: #56b6c2;
}

.dark .hljs-string,
.dark .hljs-regexp,
.dark .hljs-addition,
.dark .hljs-attribute,
.dark .hljs-meta .hljs-string {
  color: #98c379;
}

.dark .hljs-attr,
.dark .hljs-variable,
.dark .hljs-template-variable,
.dark .hljs-type,
.dark .hljs-selector-class,
.dark .hljs-selector-attr,
.dark .hljs-selector-pseudo,
.dark .hljs-number {
  color: #d19a66;
}

.dark .hljs-symbol,
.dark .hljs-bullet,
.dark .hljs-link,
.dark .hljs-meta,
.dark .hljs-selector-id,
.dark .hljs-title {
  color: #61aeee;
}

.dark .hljs-built_in,
.dark .hljs-title.class_,
.dark .hljs-class .hljs-title {
  color: #e6c07b;
}

.dark .hljs-emphasis {
  font-style: italic;
}

.dark .hljs-strong {
  font-weight: bold;
}

.dark .line-numbers .line-number {
  color: #636d83;
}
</style>
