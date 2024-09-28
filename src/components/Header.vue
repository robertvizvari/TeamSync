<template>
  <nav class="fixed z-[999] w-full border-gray-200 backdrop-blur-xl backdrop-brightness-[.99] dark:backdrop-brightness-75">
    <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
      <a href="#home" class="flex items-center space-x-3 rtl:space-x-reverse">
        <Logo class="m-[-3px] size-10 sm:m-0 sm:size-12" />
        <span class="self-center whitespace-nowrap text-lg font-semibold text-foreground sm:text-2xl">TeamSync</span>
      </a>
      <div class="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
        <Button @click="$router.push('/dashboard')" class="text-white sm:mr-3">
          Get Started
          <Icon class="ml-2 mr-[-0.5rem] size-4" icon="radix-icons:arrow-right" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline">
              <Icon icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-foreground transition-all dark:-rotate-90 dark:scale-0" />
              <Icon icon="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-foreground transition-all dark:rotate-0 dark:scale-100" />
              <span class="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="z-[9999] border-border">
            <DropdownMenuItem @click="mode = 'light'">Light</DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'dark'">Dark</DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'auto'">System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- <button @click="showMenu = !showMenu" type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden" aria-controls="navbar-cta" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <Icon class="size-6" icon="radix-icons:hamburger-menu" />
        </button> -->
      </div>
      <!-- <div class="w-full items-center justify-between md:order-1 md:flex md:w-auto" id="navbar-cta">
        <ul class="mt-4 flex flex-col rounded-lg border border-gray-100 p-4 font-medium dark:border-gray-700 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 rtl:space-x-reverse">
          <li>
            <a href="#" class="block rounded bg-primary px-3 py-2 text-foreground md:bg-transparent md:p-0 md:text-primary" aria-current="page">Home</a>
          </li>
          <li>
            <a href="#" class="block rounded px-3 py-2 text-muted-foreground transition-all duration-200 hover:bg-muted dark:border-border dark:hover:bg-muted dark:hover:text-foreground md:p-0 md:hover:bg-transparent md:hover:text-primary md:dark:hover:bg-transparent md:dark:hover:text-primary">About</a>
          </li>
          <li>
            <a href="#" class="block rounded px-3 py-2 text-muted-foreground transition-all duration-200 hover:bg-muted dark:border-border dark:hover:bg-muted dark:hover:text-foreground md:p-0 md:hover:bg-transparent md:hover:text-primary md:dark:hover:bg-transparent md:dark:hover:text-primary">Services</a>
          </li>
          <li>
            <a href="#" class="block rounded px-3 py-2 text-muted-foreground transition-all duration-200 hover:bg-muted dark:border-border dark:hover:bg-muted dark:hover:text-foreground md:p-0 md:hover:bg-transparent md:hover:text-primary md:dark:hover:bg-transparent md:dark:hover:text-primary">Contact</a>
          </li>
        </ul>
      </div> -->
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      showMenu: false,
    }
  },
}
</script>

<script setup>
import { useColorMode } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Logo from '@/assets/svg/Logo.vue'

const mode = useColorMode()
</script>
