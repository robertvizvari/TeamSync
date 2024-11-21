<template>
  <div class="bg-background">
    <Header />
    <section class="pt-10" id="home">
      <div class="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
        <div class="top_animation lg:col-span-5 lg:mt-0 lg:flex" data-aos="zoom-in" data-aos-duration="1000" data-aos-once="true">
          <LottieAnimation animationPath="/animations/home_hero.json" />
        </div>
        <div class="mr-auto place-self-center lg:col-span-7">
          <h1 class="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-foreground md:text-5xl xl:text-6xl" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">Collaborate Smarter, Not Harder.</h1>
          <p class="mb-6 max-w-2xl text-muted-foreground md:text-lg lg:mb-8 lg:text-xl" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1000" data-aos-once="true">Manage your team, track tasks, and stay productive with TeamSync.</p>
          <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000" data-aos-once="true">
            <Button @click="$router.push('/login')" class="text-white" size="lg">
              Get Started
              <ArrowRight class="ml-2 mr-[-0.5rem] size-4" />
            </Button>
            <a href="#learn-more">
              <Button variant="outline" class="ml-2 text-foreground" size="lg">Learn more</Button>
            </a>
          </div>
        </div>
        <div class="bottom_animation lg:col-span-5 lg:mt-0 lg:flex" data-aos="zoom-in" data-aos-duration="1000" data-aos-once="true">
          <LottieAnimation animationPath="/animations/home_hero.json" />
        </div>
      </div>
    </section>

    <section id="learn-more" class="scroll-m-32">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div class="mb-8 max-w-screen-md lg:mb-16">
          <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-foreground" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">Key Features to Boost Team Efficiency</h2>
          <p class="text-muted-foreground sm:text-xl" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1000" data-aos-once="true">Everything your team needs to stay organized, productive, and on track.</p>
        </div>
        <div class="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
          <div class="rounded-lg border border-border p-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="50" data-aos-once="true">
            <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary lg:h-12 lg:w-12">
              <Users class="size-5 text-white lg:size-6" />
            </div>
            <h3 class="mb-2 text-xl font-bold text-foreground">Team Creation</h3>
            <p class="text-muted-foreground">Easily create teams and invite members.</p>
          </div>
          <div class="rounded-lg border border-border p-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="150" data-aos-once="true">
            <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary lg:h-12 lg:w-12">
              <CircleCheck class="size-5 text-white lg:size-6" />
            </div>
            <h3 class="mb-2 text-xl font-bold text-foreground">Task Management</h3>
            <p class="text-muted-foreground">Assign tasks, track progress, and stay on top of deadlines.</p>
          </div>
          <div class="rounded-lg border border-border p-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="250" data-aos-once="true">
            <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary lg:h-12 lg:w-12">
              <History class="size-5 text-white lg:size-6" />
            </div>
            <h3 class="mb-2 text-xl font-bold text-foreground">Time Tracking</h3>
            <p class="text-muted-foreground">Log hours worked and measure productivity in real time.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-screen-xl items-center gap-16 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16">
        <div>
          <LottieAnimation animationPath="/animations/home_task.json" data-aos="zoom-in" data-aos-duration="1000" data-aos-once="true" />
        </div>
        <div class="font-light text-gray-500 dark:text-gray-400 sm:text-lg">
          <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">Task Management with Clarity and Control</h2>
          <p class="mb-4" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1000" data-aos-once="true">With TeamSync's intuitive task management system, you can easily oversee your team’s entire workload in one place. Gain full visibility into which tasks are assigned to whom, their current statuses, and overall project progress. This transparency allows you to detect issues early, redistribute tasks to avoid bottlenecks, and ensure every team member knows what’s expected of them.</p>
        </div>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-screen-xl items-center gap-16 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16">
        <div class="top_text font-light text-gray-500 dark:text-gray-400 sm:text-lg">
          <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">Boost Team Collaboration and Productivity</h2>
          <p class="mb-4" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1000" data-aos-once="true">TeamSync is designed to foster seamless team collaboration, whether your team is in the same office or spread across the globe. With real-time updates on task statuses and built-in notifications, everyone stays in the loop. You can communicate directly within tasks, share updates, and easily delegate or shift priorities as the project progresses. This collaborative environment helps teams work more efficiently and stay aligned toward their goals.</p>
        </div>
        <div>
          <LottieAnimation animationPath="/animations/home_collaboration.json" data-aos="zoom-in" data-aos-duration="1000" data-aos-once="true" />
        </div>
        <div class="bottom_text font-light text-gray-500 dark:text-gray-400 sm:text-lg">
          <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">Boost Team Collaboration and Productivity</h2>
          <p class="mb-4" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1000" data-aos-once="true">TeamSync is designed to foster seamless team collaboration, whether your team is in the same office or spread across the globe. With real-time updates on task statuses and built-in notifications, everyone stays in the loop. You can communicate directly within tasks, share updates, and easily delegate or shift priorities as the project progresses. This collaborative environment helps teams work more efficiently and stay aligned toward their goals.</p>
        </div>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-screen-xl items-center gap-16 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16">
        <div>
          <LottieAnimation animationPath="/animations/home_dashboard.json" data-aos="zoom-in" data-aos-duration="1000" data-aos-once="true" />
        </div>
        <div class="font-light text-gray-500 dark:text-gray-400 sm:text-lg">
          <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">Progress and Productivity Insights</h2>
          <p class="mb-4" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1000" data-aos-once="true">The TeamSync dashboard not only tracks task progress but also gives you key insights into your team’s productivity. With detailed reports on hours worked, task completion rates, and overall team performance, you can easily identify top performers, adjust timelines, and ensure projects stay on track. This feature empowers team leaders to make informed decisions that keep projects running smoothly.</p>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { Button } from '../components/ui/button'
import { ArrowRight, CircleCheck, History, Users } from 'lucide-vue-next'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import LottieAnimation from '../components/LottieAnimation.vue'
</script>

<style>
@media (max-width: 1023px) {
  .top_text,
  .bottom_animation {
    display: none;
  }
}
@media (min-width: 1024px) {
  .bottom_text,
  .top_animation {
    display: none;
  }
}
</style>
