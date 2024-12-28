<template>
  <nav class="fixed top-0 z-50 w-full border-b border-gray-200 bg-muted dark:border-gray-700">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
          <button v-if="$route.path !== '/account'" @click="toggleSidebar()" data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden">
            <span class="sr-only">{{ $t('navbar.sidebar.openButton') }}</span>
            <svg class="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
          </button>
          <router-link to="/dashboard/mytasks" class="ms-2 flex md:me-24">
            <Logo class="mr-2 size-10" />
            <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl">{{ $t('navbar.sidebar.logoText') }}</span>
          </router-link>
        </div>
        <div class="flex items-center">
          <DarkModeButton :color="'light'" />

          <div class="ms-3 flex items-center">
            <div>
              <button @click="userSettings = !userSettings" type="button" class="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                <span class="sr-only">{{ $t('navbar.userMenu.openUserMenu') }}</span>
                <Avatar :class="!user.profilePicture ? 'border border-gray-600' : ''" class="h-8 w-8 rounded-full">
                  <AvatarImage :src="user.profilePicture" alt="User photo" />
                  <AvatarFallback v-if="user && user.name && user.surname" class="text-md font-bold uppercase">
                    {{ user.name.slice(0, 1) + user.surname.slice(0, 1) }}
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
            <Transition name="slide-fade">
              <div v-if="userSettings" class="absolute right-2 top-10 z-50 my-4 max-w-[250px] list-none divide-y divide-gray-100 rounded border border-gray-200 bg-white text-base shadow dark:divide-gray-600 dark:border-gray-700 dark:bg-muted" id="dropdown-user">
                <div class="px-4 py-3" role="none">
                  <p class="text-sm text-gray-900 dark:text-white" role="none">{{ user.name + ' ' + user.surname }}</p>
                  <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-300" role="none">{{ user.email }}</p>
                </div>
                <ul class="pt-1" role="none">
                  <li>
                    <router-link v-if="$route.path == '/account'" to="/dashboard/mytasks" class="block px-4 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">{{ $t('navbar.userMenu.dashboard') }}</router-link>
                    <router-link v-if="$route.path !== '/account'" to="/account" class="block px-4 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">{{ $t('navbar.userMenu.account') }}</router-link>
                    <router-link to="#" class="block px-4 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">{{ $t('navbar.userMenu.settings') }}</router-link>
                    <span @click="showDialog = true" class="block cursor-pointer px-4 py-2 text-sm text-red-400 transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-500" role="menuitem">{{ $t('navbar.userMenu.logout') }}</span>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <div v-if="userSettings" @click="userSettings = false" class="absolute right-0 top-0 h-screen w-screen bg-transparent"></div>

    <Transition name="fade">
      <div v-if="showDialog" @click="showDialog = false" class="fixed left-1/2 top-1/2 z-[9999] flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-60">
        <div class="grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg" style="pointer-events: auto">
          <div class="flex flex-col gap-y-2 text-center sm:text-left">
            <h2 class="text-lg font-semibold text-foreground">{{ $t('navbar.userMenu.confirmation.title') }}</h2>
            <p class="text-sm text-muted-foreground">{{ $t('navbar.userMenu.confirmation.description') }}</p>
          </div>
          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
            <Button @click="showDialog = false" class="mt-2 font-normal text-foreground sm:mt-0" size="sm" variant="outline">{{ $t('navbar.userMenu.confirmation.cancel') }}</Button>
            <Button @click="logout" class="bg-red-500 font-normal text-white hover:bg-red-400" size="sm">{{ $t('navbar.userMenu.confirmation.confirm') }}</Button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth'
import { toast } from 'vue-sonner'

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || [],
      userSettings: false,
      showDialog: false,
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar')
    },

    async logout() {
      try {
        const auth = getAuth()

        await signOut(auth)

        localStorage.removeItem('user')

        toast.success('You have been logged out successfully.')

        this.$router.push('/')
      } catch (error) {
        toast.error(`Logout failed: ${error.message}`)
        console.error(error)
      }
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user')) || []
  },
}
</script>

<script setup>
import Logo from '@/assets/svg/Logo.vue'
import DarkModeButton from '@/components/Dark_Mode.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
