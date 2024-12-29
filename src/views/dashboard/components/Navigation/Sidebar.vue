<template>
  <div @click="toggleSidebar()" :class="sidebarActive ? 'fixed left-0 top-0 h-screen w-screen bg-black bg-opacity-40' : ''" class="transition-all duration-300 ease-in-out"></div>
  <aside id="logo-sidebar" :class="sidebarActive ? 'translate-x-0' : '-translate-x-full'" class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-muted pt-20 transition-transform duration-300 dark:border-gray-700 sm:translate-x-0" aria-label="Sidebar">
    <div class="h-full overflow-y-auto bg-muted px-3 pb-4">
      <ul class="flex w-full flex-col gap-2 font-medium">
        <li>
          <a @click="setUrlId($t('sidebar.links.mytasks.id')), toggleSidebar()" :class="urlId == $t('sidebar.links.mytasks.id') ? 'bg-primary text-white' : 'cursor-pointer text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'" class="group flex select-none items-center rounded-lg p-2 transition duration-150">
            <Icon :class="urlId == $t('sidebar.links.mytasks.id') ? 'text-white' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'" class="h-5 w-5 transition duration-150" :icon="$t('sidebar.links.mytasks.icon')" />
            <span class="ms-3">{{ $t('sidebar.links.mytasks.name') }}</span>
          </a>
        </li>
        <li>
          <a @click="setUrlId($t('sidebar.links.myprojects.id')), toggleSidebar()" :class="urlId == $t('sidebar.links.myprojects.id') ? 'bg-primary text-white' : 'cursor-pointer text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'" class="group flex select-none items-center rounded-lg p-2 transition duration-150">
            <Icon :class="urlId == $t('sidebar.links.myprojects.id') ? 'text-white' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'" class="h-5 w-5 transition duration-150" :icon="$t('sidebar.links.myprojects.icon')" />
            <span class="ms-3">{{ $t('sidebar.links.myprojects.name') }}</span>
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
</script>
