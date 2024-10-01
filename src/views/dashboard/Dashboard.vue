<template>
  <div class="bg-background">
    <Sidebar :sidebarActive="sidebarActive" :urlId="urlId" />

    <Navbar @toggle-sidebar="toggleSidebar" />

    <Transition name="slide-fade">
      <Tasks v-if="urlId == 'tasks'" />
    </Transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sidebarActive: false,
      urlId: null,
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarActive = !this.sidebarActive
    },
    handleUrlChange() {
      this.urlId = this.$route.params.urlId
    },
  },
  mounted() {
    this.handleUrlChange()
  },
  watch: {
    '$route.params.urlId': 'handleUrlChange',
  },
}
</script>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

import Tasks from './components/Tasks.vue'
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.35s ease-out;
}

.slide-fade-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
