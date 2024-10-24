<template>
  <div @click="toggleSidebar()" :class="sidebarActive ? 'fixed left-0 top-0 h-screen w-screen bg-black bg-opacity-40' : ''" class="transition-all duration-300 ease-in-out"></div>
  <aside id="logo-sidebar" :class="sidebarActive ? 'translate-x-0' : '-translate-x-full'" class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-muted pt-20 transition-transform duration-300 dark:border-gray-700 sm:translate-x-0" aria-label="Sidebar">
    <div class="h-full overflow-y-auto bg-muted px-3 pb-4">
      <ul class="flex w-full flex-col gap-2 font-medium">
        <li v-for="link in links">
          <a @click="setUrlId(link.id), toggleSidebar()" :class="urlId == link.id ? 'bg-primary text-white' : 'cursor-pointer text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'" class="group flex select-none items-center rounded-lg p-2 transition duration-150">
            <Icon :class="urlId == link.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'" class="h-5 w-5 transition duration-150" :icon="link.icon" />
            <span class="ms-3">{{ link.name }}</span>
          </a>
        </li>
        <div class="my-4 flex h-[1px] w-full select-none items-center rounded-full bg-primary pl-5 uppercase">
          <span class="bg-muted px-2 text-[0.8rem] tracking-widest text-primary">Admin</span>
        </div>
        <li v-for="link in adminLinks">
          <a @click="setUrlId(link.id), toggleSidebar()" :class="urlId == link.id ? 'bg-primary text-white' : 'cursor-pointer text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'" class="group flex select-none items-center rounded-lg p-2 transition duration-150">
            <Icon :class="urlId == link.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'" class="h-5 w-5 transition duration-150" :icon="link.icon" />
            <span class="ms-3">{{ link.name }}</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  props: ['sidebarActive', 'urlId'],
  data() {
    return {
      windowWidth: window.innerWidth,
      links: [
        { name: 'My tasks', id: 'mytasks', icon: 'radix-icons:check-circled' },
        { name: 'My projects', id: 'myprojects', icon: 'radix-icons:card-stack' },
      ],
      adminLinks: [
        { name: 'Tasks', id: 'tasks', icon: 'radix-icons:check-circled' },
        { name: 'Projects', id: 'projects', icon: 'radix-icons:card-stack' },
      ],
    }
  },
  methods: {
    setUrlId(urlId) {
      this.$router.push({ name: 'dashboard', params: { urlId: urlId } })
    },
    toggleSidebar() {
      if (this.windowWidth < 640) {
        this.$emit('toggle-sidebar')
      }
    },
    handleWidth() {
      this.windowWidth = window.innerWidth
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleWidth)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWidth)
  },
}
</script>

<script setup>
import { Icon } from '@iconify/vue'
import { Badge } from '@/components/ui/badge'
</script>
