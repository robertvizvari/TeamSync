<template>
  <PageLoader />
  <RouterView />
</template>

<script setup>
import PageLoader from './components/PageLoader.vue'
</script>

<style>
* {
  scroll-behavior: smooth;
}
html {
  background-color: hsl(var(--primary));
}
</style>
