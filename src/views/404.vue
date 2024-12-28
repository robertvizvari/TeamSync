<template>
  <section class="flex min-h-dvh items-center bg-background">
    <div class="container mx-auto flex flex-col-reverse px-6 py-12 lg:flex-row lg:items-center lg:gap-12">
      <div class="w-full lg:w-1/2">
        <h1 class="mb-4 text-xl font-extrabold tracking-tight text-primary lg:text-2xl">{{ $t('404.h1_404') }}</h1>
        <h1 class="mb-4 text-3xl font-extrabold tracking-tight text-foreground lg:text-5xl">{{ $t('404.h1_whoops') }}</h1>
        <p class="mb-4 text-lg text-muted-foreground">{{ $t('404.p_sorry') }}</p>
        {{ userLoggedIn }}

        <div class="mt-6">
          <router-link :to="userLoggedIn ? '/dashboard' : '/'">
            <Button class="text-white">{{ $t('404.router_link') }}</Button>
          </router-link>
        </div>
      </div>

      <div class="relative mx-auto w-full md:max-w-[40rem] lg:w-1/2 lg:bg-transparent">
        <LottieAnimation animationPath="/animations/404.json" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      userLoggedIn: false,
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'))
    this.userLoggedIn = user && user.uid ? true : false
  },
}
</script>

<script setup>
import { Button } from '../components/ui/button'
import LottieAnimation from '@/components/LottieAnimation.vue'
</script>
