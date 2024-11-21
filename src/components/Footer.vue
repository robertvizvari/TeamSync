<template>
  <footer class="shadow">
    <div class="mx-auto w-full max-w-screen-xl p-4 md:py-8">
      <div class="sm:flex sm:items-center sm:justify-between">
        <a href="#home" class="flex items-center space-x-3 rtl:space-x-reverse">
          <Logo class="m-0 size-12" />
          <span class="self-center whitespace-nowrap text-2xl font-semibold text-foreground">TeamSync</span>
        </a>
        <ul class="mb-6 flex flex-wrap items-center text-sm font-medium text-muted-foreground sm:mb-0">
          <li>
            <a href="#" class="me-4 transition-all duration-200 hover:text-primary md:me-6">Home</a>
          </li>
          <li>
            <Button @click="$router.push('/login')" class="mr-3 text-white">
              Get Started
              <ArrowRight class="ml-2 mr-[-0.5rem] size-4" />
            </Button>
          </li>
        </ul>
      </div>
      <hr class="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
    </div>
  </footer>
</template>

<script setup>
import Logo from '../assets/svg/Logo.vue'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'
</script>
