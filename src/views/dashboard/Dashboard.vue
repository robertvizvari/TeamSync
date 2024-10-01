<template>
  <div class="overflow-x-hidden bg-background">
    <Sidebar :sidebarActive="sidebarActive" :urlId="urlId" />

    <Navbar @toggle-sidebar="toggleSidebar" />

    <Tasks v-show="urlId == 'tasks'" />
    <Projects v-show="urlId == 'projects'" />
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
import Projects from './components/Projects.vue'
</script>
