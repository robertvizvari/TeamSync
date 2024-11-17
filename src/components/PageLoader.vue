<template>
  <Transition name="fade">
    <div v-if="!isLoaded && isDesktop" class="fixed left-0 top-0 z-[99999] flex h-screen w-screen items-center justify-center bg-background">
      <div class="flex h-full w-full flex-col items-center justify-center gap-3 md:mr-32 md:flex-row">
        <Logo class="size-48 sm:size-60 md:size-64" :animate="true" />
        <span class="self-center whitespace-nowrap text-[2.8rem] text-xl font-semibold text-foreground sm:text-[3.5rem] md:text-[4rem]">TeamSync</span>
      </div>
    </div>
  </Transition>
</template>

<script>
import Logo from '../assets/svg/Logo.vue'
export default {
  data() {
    return {
      isLoaded: false,
      isDesktop: true,
    }
  },
  components: {
    Logo,
  },
  methods: {
    checkDevice() {
      this.isDesktop = window.matchMedia('(min-width: 768px)').matches
    },
  },
  mounted() {
    this.checkDevice()

    window.addEventListener('resize', this.checkDevice)

    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        this.isLoaded = true
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkDevice)
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
