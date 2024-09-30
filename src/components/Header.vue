<template>
  <nav class="fixed z-[999] w-full border-gray-200 backdrop-blur-xl backdrop-brightness-[.99] dark:backdrop-brightness-75">
    <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
      <a href="#home" class="flex items-center space-x-3 rtl:space-x-reverse">
        <Logo class="m-[-3px] size-10 sm:m-0 sm:size-12" />
        <span class="text-foreground self-center whitespace-nowrap text-lg font-semibold sm:text-2xl">TeamSync</span>
      </a>
      <div class="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
        <Button @click="$router.push('/dashboard')" class="text-white sm:mr-3">
          Get Started
          <Icon class="ml-2 mr-[-0.5rem] size-4" icon="radix-icons:arrow-right" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline">
              <Icon icon="radix-icons:moon" class="text-foreground h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Icon icon="radix-icons:sun" class="text-foreground absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span class="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="border-border z-[9999]">
            <DropdownMenuItem @click="mode = 'light'">Light</DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'dark'">Dark</DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'auto'">System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
