<template>
  <section class="flex min-h-screen w-full items-center bg-background">
    <div class="container mx-auto flex flex-col px-6 py-12 lg:flex-row lg:items-center lg:gap-12">
      <div class="mx-auto w-full">
        <router-link to="/" class="mb-6 flex items-center justify-center text-2xl font-semibold text-foreground">
          <Logo class="mr-2 size-10" alt="logo" />
          TeamSync
        </router-link>
        <div class="min-w-full rounded-lg border-border bg-muted shadow dark:bg-primary-foreground sm:max-w-md md:mt-0 xl:p-0">
          <div class="w-full space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-foreground">Log in to your account</h1>
            <form class="space-y-4 md:space-y-6" action="#">
              <div>
                <label for="email" class="mb-2 block text-sm font-medium text-foreground">Email</label>
                <Input class="text-foreground" type="email" name="email" placeholder="Email" />
              </div>
              <div>
                <label for="password" class="mb-2 block text-sm font-medium text-foreground">Password</label>
                <div class="relative">
                  <Input class="text-foreground" :type="!showPassword ? 'password' : 'text'" placeholder="••••••••" />
                  <Icon @click="showPassword = !showPassword" class="absolute right-5 top-1/2 size-5 -translate-y-1/2 transform cursor-pointer text-foreground" :icon="!showPassword ? 'radix-icons:eye-open' : 'radix-icons:eye-closed'" />
                </div>
              </div>
              <div class="flex items-center justify-between">
                <a href="#" class="text-sm font-medium text-primary hover:underline">Forgot password?</a>
              </div>
              <Button class="w-full text-white">Log in</Button>
              <p class="text-center text-sm font-light text-muted-foreground">
                Don't have an account?
                <router-link to="/register" class="text-primary-600 dark:text-primary-500 font-medium hover:underline">Register</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <div class="lottie relative mx-auto hidden lg:flex lg:max-w-[40rem]">
        <LottieAnimation animationPath="/animations/Login.json" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      showPassword: false,
    }
  },
}
</script>

<script setup>
import Logo from '@/assets/svg/Logo.vue'
import LottieAnimation from '@/components/LottieAnimation.vue'
import { Icon } from '@iconify/vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
</script>

<style scoped>
@media (max-width: 1225px) {
  .lottie {
    max-width: 35rem;
  }
}
</style>
