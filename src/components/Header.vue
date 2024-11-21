<template>
  <nav :class="showBlur ? 'nav_blur' : ''" class="fixed z-[99] w-full border-gray-200 transition-all duration-300">
    <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
      <a href="#home" class="flex items-center space-x-3 rtl:space-x-reverse">
        <Logo class="m-[-3px] size-10 sm:m-0 sm:size-12" />
        <span class="self-center whitespace-nowrap text-lg font-semibold text-foreground sm:text-2xl">TeamSync</span>
      </a>
      <div class="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
        <Button @click="$router.push('/login')" class="text-white sm:mr-3">
          Get Started
          <ArrowRight class="ml-2 mr-[-0.5rem] size-4" />
        </Button>

        <DarkModeButton />
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      showMenu: false,
      showBlur: false,
    }
  },
  methods: {
    handleScroll() {
      if (window.scrollY == 0) {
        this.showBlur = false
      } else {
        this.showBlur = true
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>

<script setup>
import { useColorMode } from '@vueuse/core'
import { ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import DarkModeButton from './Dark_Mode.vue'
import Logo from '@/assets/svg/Logo.vue'

const mode = useColorMode()
</script>

<style>
.nav_blur {
  backdrop-filter: blur(10px) brightness(0.99);
  transition: all 1000ms;
}

.dark .nav_blur {
  backdrop-filter: blur(10px) brightness(0.75);
  transition: all 1000ms;
}
</style>
