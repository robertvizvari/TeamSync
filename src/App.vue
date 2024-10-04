<template>
  <PageLoader />
  <Toaster richColors />
  <RouterView />
</template>

<script setup>
import { useColorMode } from '@vueuse/core'
import PageLoader from './components/PageLoader.vue'
import { Toaster } from '@/components/ui/sonner'
import { watchEffect, onMounted } from 'vue'

const mode = useColorMode()

onMounted(() => {
  if (mode.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

watchEffect(() => {
  if (mode.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<style>
* {
  scroll-behavior: smooth;
}

html {
  background-color: hsl(var(--primary));
}

/* * {
  scrollbar-width: auto;
  scrollbar-color: hsl(var(--primary));
}

*::-webkit-scrollbar {
  width: 14px;
}

*::-webkit-scrollbar-track {
  background: hsl(var(--muted));
}

*::-webkit-scrollbar-thumb {
  background-color: hsl(var(--primary));
  border-radius: 10px;
} */
</style>
