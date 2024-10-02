<template>
  <section class="flex min-h-screen w-full items-center bg-background">
    <div class="container mx-auto flex flex-col px-6 py-12 lg:flex-row lg:items-center lg:gap-12">
      <div class="mx-auto w-full">
        <router-link to="/" class="mb-6 flex items-center justify-center text-2xl font-semibold text-foreground">
          <Logo class="mr-2 size-10" alt="logo" />
          TeamSync - Register
        </router-link>
        <div class="min-w-full rounded-lg border-border bg-muted shadow dark:bg-primary-foreground sm:max-w-md md:mt-0 xl:p-0">
          <div class="w-full space-y-4 p-6 sm:p-8 md:space-y-6">
            <div class="space-y-4 md:space-y-6">
              <div>
                <label for="email" class="mb-2 block text-sm font-medium text-foreground">Email</label>
                <Input v-model="email" class="text-foreground" type="email" name="email" placeholder="Email" />
              </div>
              <div>
                <label for="password" class="mb-2 block text-sm font-medium text-foreground">Password</label>
                <div class="relative">
                  <Input v-model="password" class="text-foreground" :type="!showPassword ? 'password' : 'text'" placeholder="••••••••" />
                  <Icon @click="showPassword = !showPassword" class="absolute right-5 top-1/2 size-5 -translate-y-1/2 transform cursor-pointer text-foreground" :icon="!showPassword ? 'radix-icons:eye-open' : 'radix-icons:eye-closed'" />
                </div>
              </div>
              <div>
                <label for="password" class="mb-2 block text-sm font-medium text-foreground">Confirm password</label>
                <div class="relative">
                  <Input v-model="confirm_password" class="text-foreground" :type="!showPassword2 ? 'password' : 'text'" placeholder="••••••••" />
                  <Icon @click="showPassword2 = !showPassword2" class="absolute right-5 top-1/2 size-5 -translate-y-1/2 transform cursor-pointer text-foreground" :icon="!showPassword2 ? 'radix-icons:eye-open' : 'radix-icons:eye-closed'" />
                </div>
              </div>
              <Button @click="validate()" class="w-full text-white">Register</Button>
              <p class="text-center text-sm font-light text-muted-foreground">
                Already have an account?
                <router-link to="/login" class="text-primary-600 dark:text-primary-500 font-medium hover:underline">Log in</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lottie relative ml-auto hidden w-full lg:flex">
        <LottieAnimation class="absolute right-10 top-[-13rem] lg:max-w-[35rem]" animationPath="/animations/Register.json" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirm_password: '',
      showPassword: false,
      showPassword2: false,
    }
  },
  methods: {
    validate() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email || !emailPattern.test(this.email)) {
        toast.warning('Please enter a valid email')
        return false
      }
      if (!this.password || this.password.length < 6) {
        toast.warning('Password must be at least 6 characters long')
        return false
      }
      if (this.password !== this.confirm_password) {
        toast.warning('Passwords do not match')
        return false
      }
      toast.success('Inputs are valid!')
      this.$router.push('/login')
      return true
    },
  },
}
</script>

<script setup>
import Logo from '@/assets/svg/Logo.vue'
import LottieAnimation from '@/components/LottieAnimation.vue'
import { Icon } from '@iconify/vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
</script>

<style scoped>
@media (max-width: 1225px) {
  .lottie {
    max-width: 35rem;
  }
}
</style>
