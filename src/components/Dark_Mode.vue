<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button :class="color == 'light' ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : ''" variant="outline" size="sm">
        <Moon class="0 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-foreground transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Sun class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-foreground transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="z-[9999] border-border">
      <DropdownMenuItem :disabled="mode == 'light'" @click="mode = 'light'" class="cursor-pointer">{{ $t('buttons.light') }}</DropdownMenuItem>
      <DropdownMenuItem :disabled="mode == 'dark'" @click="mode = 'dark'" class="cursor-pointer">{{ $t('buttons.dark') }}</DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'auto'" class="cursor-pointer">{{ $t('buttons.system') }}</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script>
export default {
  props: {
    color: {
      default: 'dark',
    },
  },
}
</script>

<script setup>
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Moon, Sun } from 'lucide-vue-next'

const mode = useColorMode()
</script>
