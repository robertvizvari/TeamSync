<template>
  <div class="bg-background">
    <Header />
    <section>
      <div class="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
        <div class="mr-auto place-self-center lg:col-span-7">
          <h1 class="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-foreground md:text-5xl xl:text-6xl">Collaborate Smarter, Not Harder.</h1>
          <p class="mb-6 max-w-2xl text-muted-foreground md:text-lg lg:mb-8 lg:text-xl">Manage your team, track tasks, and stay productive with TeamSync.</p>
          <Button class="text-white" size="lg">
            Get Started
            <Icon class="ml-2 mr-[-0.5rem] size-4" icon="radix-icons:arrow-right" />
          </Button>
          <a href="#learn-more">
            <Button variant="outline" class="ml-2 text-foreground" size="lg">Learn more</Button>
          </a>
        </div>
        <div class="hidden lg:col-span-5 lg:mt-0 lg:flex">
          <LottieAnimation animationPath="/animations/home_hero.json" />
        </div>
      </div>
    </section>

    <section id="learn-more">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div class="mb-8 max-w-screen-md lg:mb-16">
          <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-foreground">Key Features to Boost Team Efficiency</h2>
          <p class="text-muted-foreground sm:text-xl">Everything your team needs to stay organized, productive, and on track.</p>
        </div>
        <div class="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
          <div class="rounded-lg border border-border p-4">
            <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary lg:h-12 lg:w-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people size-5 text-white lg:size-6" viewBox="0 0 16 16">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
              </svg>
            </div>
            <h3 class="mb-2 text-xl font-bold text-foreground">Team Creation</h3>
            <p class="text-muted-foreground">Easily create teams and invite members.</p>
          </div>
          <div class="rounded-lg border border-border p-4">
            <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary lg:h-12 lg:w-12">
              <Icon class="size-5 text-white lg:size-6" icon="radix-icons:check-circled" />
            </div>
            <h3 class="mb-2 text-xl font-bold text-foreground">Task Management</h3>
            <p class="text-muted-foreground">Assign tasks, track progress, and stay on top of deadlines.</p>
          </div>
          <div class="rounded-lg border border-border p-4">
            <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary lg:h-12 lg:w-12">
              <Icon class="size-5 text-white lg:size-6" icon="radix-icons:timer" />
            </div>
            <h3 class="mb-2 text-xl font-bold text-foreground">Time Tracking</h3>
            <p class="text-muted-foreground">Log hours worked and measure productivity in real time.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Button } from '../components/ui/button'
import { Icon } from '@iconify/vue'
import Header from '../components/Header.vue'
import LottieAnimation from '../components/LottieAnimation.vue'
</script>
