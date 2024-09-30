<template>
  <section class="bg-background flex min-h-[100dvh] items-center">
    <div class="container mx-auto flex flex-col-reverse px-6 py-12 lg:flex-row lg:items-center lg:gap-12">
      <div class="w-full lg:w-1/2">
        <h1 class="text-primary mb-4 text-xl font-extrabold tracking-tight lg:text-2xl">404 Not Found</h1>
        <h1 class="text-foreground mb-4 text-3xl font-extrabold tracking-tight lg:text-5xl">Whoops! That page doesn’t exist.</h1>
        <p class="text-muted-foreground mb-4 text-lg">Sorry, we can't find that page. You'll find lots to explore on the home page.</p>

        <div class="mt-6">
          <router-link to="/">
            <Button class="text-white">Back to Homepage</Button>
          </router-link>
        </div>
      </div>

      <div class="relative mx-auto w-full md:max-w-[40rem] lg:w-1/2 lg:bg-transparent">
        <LottieAnimation animationPath="/animations/404.json" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { Button } from '../components/ui/button'
import LottieAnimation from '@/components/LottieAnimation.vue'
</script>
