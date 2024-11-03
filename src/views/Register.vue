<template>
  <section class="flex min-h-dvh w-full items-center bg-background">
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
                <label for="name" class="mb-2 block text-sm font-medium text-foreground">Name</label>
                <Input v-model="name" class="text-foreground" type="text" name="name" placeholder="John" />
              </div>
              <div>
                <label for="surname" class="mb-2 block text-sm font-medium text-foreground">Surname</label>
                <Input v-model="surname" class="text-foreground" type="text" name="surname" placeholder="Doe" />
              </div>
              <div>
                <label for="surname" class="mb-2 block text-sm font-medium text-foreground">Birth date</label>
                <input class="w-full rounded-md border border-border bg-background p-2 text-foreground" type="date" v-model="birth_date" />
              </div>
              <div>
                <label for="email" class="mb-2 block text-sm font-medium text-foreground">Email</label>
                <Input v-model="email" class="text-foreground" type="email" name="email" placeholder="Email" />
              </div>
              <div>
                <label for="password" class="mb-2 block text-sm font-medium text-foreground">Password</label>
                <div class="relative">
                  <Input v-model="password" @input="sanitizeInput($event, 'password')" class="text-foreground" :type="!showPassword ? 'password' : 'text'" placeholder="••••••••" />
                  <Icon @click="showPassword = !showPassword" :class="password.length < 1 ? 'scale-0' : ''" class="absolute right-5 top-1/2 size-5 -translate-y-1/2 transform cursor-pointer text-foreground transition-all duration-200" :icon="!showPassword ? 'radix-icons:eye-open' : 'radix-icons:eye-closed'" />
                </div>
              </div>
              <div>
                <label for="password" class="mb-2 block text-sm font-medium text-foreground">Confirm password</label>
                <div class="relative">
                  <Input v-model="confirm_password" @input="sanitizeInput($event, 'confirm_password')" class="text-foreground" :type="!showPassword2 ? 'password' : 'text'" placeholder="••••••••" />
                  <Icon @click="showPassword2 = !showPassword2" :class="confirm_password.length < 1 ? 'scale-0' : ''" class="absolute right-5 top-1/2 size-5 -translate-y-1/2 transform cursor-pointer text-foreground transition-all duration-200" :icon="!showPassword2 ? 'radix-icons:eye-open' : 'radix-icons:eye-closed'" />
                </div>
              </div>
              <Button @click="register" class="w-full text-white">Register</Button>
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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import store from '@/store'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'vue-sonner'

export default {
  data() {
    return {
      name: '',
      surname: '',
      birth_date: '',
      email: '',
      password: '',
      confirm_password: '',
      showPassword: false,
      showPassword2: false,
    }
  },
  methods: {
    sanitizeInput(event, id) {
      const sanitizedValue = event.target.value.replace(/\s+/g, '')
      if (id === 'password') {
        this.password = sanitizedValue
      } else if (id === 'confirm_password') {
        this.confirm_password = sanitizedValue
      }
    },
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
      return true
    },
    async register() {
      if (!this.validate()) return

      try {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password)

        const displayName = `${this.name} ${this.surname}`
        await updateProfile(userCredential.user, { displayName })

        const userDoc = {
          uid: userCredential.user.uid,
          name: this.name,
          surname: this.surname,
          email: this.email,
          birth_date: this.birth_date,
        }
        await setDoc(doc(db, 'users', userCredential.user.uid), userDoc)

        store.commit('setUser', userDoc)

        await sendEmailVerification(userCredential.user)
        toast.success('Registration successful! Please check your email for verification.')
        this.$router.push('/login')
      } catch (error) {
        toast.error(`Error: ${error.message}`)
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

.dark input[type='date'] {
  color-scheme: dark;
}
</style>
