<template>
  <nav class="fixed top-0 z-50 w-full border-b border-gray-200 bg-muted dark:border-gray-700">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
          <button @click="toggleSidebar()" data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden">
            <span class="sr-only">Open sidebar</span>
            <svg class="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
          </button>
          <router-link to="/" class="ms-2 flex md:me-24">
            <Logo class="mr-2 size-10" />
            <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl">TeamSync</span>
          </router-link>
        </div>
        <div class="flex items-center">
          <div class="ms-3 flex items-center">
            <div>
              <button @click="userSettings = !userSettings" type="button" class="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
              </button>
            </div>
            <Transition name="slide-fade">
              <div v-if="userSettings" class="absolute right-2 top-10 z-50 my-4 list-none divide-y divide-gray-100 rounded border border-gray-200 bg-white text-base shadow dark:divide-gray-600 dark:border-gray-700 dark:bg-muted" id="dropdown-user">
                <div class="px-4 py-3" role="none">
                  <p class="text-sm text-gray-900 dark:text-white" role="none">Neil Sims</p>
                  <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-300" role="none">neil.sims@flowbite.com</p>
                </div>
                <ul class="py-1" role="none">
                  <li v-for="link in userSettingsLinks">
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                      {{ link.name }}
                    </a>
                  </li>
                </ul>
                <!-- <div @click="userSettings = false" class="absolute right-0 top-0 h-screen w-screen bg-transparent"></div> -->
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      userSettings: false,
      userSettingsLinks: [{ name: 'Account' }, { name: 'Settings' }, { name: 'Log out' }],
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar')
    },
  },
}
</script>

<script setup>
import Logo from '../../../assets/svg/Logo.vue'
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-120px) translateX(70px) rotate(20deg) scale(0);
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateY(0) translateX(0) rotate(0deg) scale(1);
  opacity: 1;
}
</style>
