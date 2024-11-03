<template>
  <section class="flex min-h-dvh w-full items-center bg-background">
    <div class="container mx-auto flex flex-col px-6 py-12 lg:flex-row lg:items-center lg:gap-12">
      <div class="mx-auto w-full">
        <router-link to="/" class="mb-6 flex items-center justify-center text-2xl font-semibold text-foreground">
          <Logo class="mr-2 size-10" alt="logo" />
          TeamSync - Log in
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
                  <Input v-model="password" @input="sanitizeInput($event)" class="text-foreground" :type="!showPassword ? 'password' : 'text'" placeholder="••••••••" />
                  <Icon @click="showPassword = !showPassword" :class="password.length < 1 ? 'scale-0' : ''" class="absolute right-5 top-1/2 size-5 -translate-y-1/2 transform cursor-pointer text-foreground transition-all duration-200" :icon="!showPassword ? 'radix-icons:eye-open' : 'radix-icons:eye-closed'" />
                </div>
              </div>
              <div class="flex items-center justify-between">
                <a @click.prevent="resetPassword" href="#" class="text-sm font-medium text-primary hover:underline">Forgot password?</a>
              </div>
              <Button v-if="!loading" @click="login" class="w-full text-white">Log in</Button>
              <Button v-if="loading" disabled class="w-full text-white">
                <Icon class="mr-2 animate-spin" icon="radix-icons:symbol" />
                Log in
              </Button>
              <p class="text-center text-sm font-light text-muted-foreground">
                Don't have an account?
                <router-link to="/register" class="text-primary-600 dark:text-primary-500 font-medium hover:underline">Register</router-link>
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
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'vue-sonner'

export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      loading: false,
    }
  },
  methods: {
    sanitizeInput(event) {
      const sanitizedValue = event.target.value.replace(/\s+/g, '')
      this.password = sanitizedValue
    },
    validateInputs() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email || !emailPattern.test(this.email)) {
        toast.warning('Please enter a valid email')
        return false
      }
      if (!this.password || this.password.length < 6) {
        toast.warning('Password must be at least 6 characters long')
        return false
      }
      return true
    },
    async login() {
      if (!this.validateInputs()) return

      this.loading = true
      const auth = getAuth()
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password)
        toast.success('Login successful!')
        this.$router.push('/dashboard/mytasks')

        this.loading = false
      } catch (error) {
        switch (error.code) {
          case 'auth/wrong-password':
            toast.error('Incorrect password. Please try again.')
            break
          case 'auth/user-not-found':
            toast.error('No account found with this email. Please register first.')
            break
          case 'auth/too-many-requests':
            toast.warning('Too many unsuccessful attempts. Please try again later.')
            break
          case 'auth/network-request-failed':
            toast.error('Network error. Check your internet connection.')
            break
          default:
            toast.error('An error occurred. Please try again.')
        }

        this.loading = false
      }
    },
    async resetPassword() {
      this.loading = true

      if (!this.email) {
        toast.warning('Please enter your email to reset password')
        this.loading = false
        return
      }

      const auth = getAuth()
      try {
        await sendPasswordResetEmail(auth, this.email)
        toast.success('Password reset email sent! Check your inbox.')

        this.loading = false
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
            toast.error('No account found with this email.')
            break
          case 'auth/invalid-email':
            toast.warning('Invalid email format. Please enter a correct email.')
            break
          case 'auth/network-request-failed':
            toast.error('Network error. Check your internet connection.')
            break
          default:
            toast.error('An error occurred. Please try again.')
        }

        this.loading = false
      }
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
</script>

<style scoped>
@media (max-width: 1225px) {
  .lottie {
    max-width: 35rem;
  }
}
</style>
