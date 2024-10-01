<template>
  <footer class="shadow">
    <div class="mx-auto w-full max-w-screen-xl p-4 md:py-8">
      <div class="sm:flex sm:items-center sm:justify-between">
        <a href="#home" class="flex items-center space-x-3 rtl:space-x-reverse">
          <Logo class="m-0 size-12" />
          <span class="text-foreground self-center whitespace-nowrap text-2xl font-semibold">TeamSync</span>
        </a>
        <ul class="text-muted-foreground mb-6 flex flex-wrap items-center text-sm font-medium sm:mb-0">
          <li>
            <a href="#" class="hover:text-primary me-4 transition-all duration-200 md:me-6">Home</a>
          </li>
          <li>
            <Button @click="$router.push('/dashboard/tasks')" class="mr-3 text-white">
              Get Started
              <Icon class="ml-2 mr-[-0.5rem] size-4" icon="radix-icons:arrow-right" />
            </Button>
          </li>
        </ul>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8 dark:border-gray-700" />
    </div>
  </footer>
</template>

<script setup>
import Logo from '../assets/svg/Logo.vue'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
</script>
