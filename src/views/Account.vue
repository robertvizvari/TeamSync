<template>
  <div class="flex h-dvh w-full items-center justify-center bg-background">
    <Navbar />

    <div class="mx-auto w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-center">
        <template v-if="!isEditing">
          <img v-if="profilePicture" :src="profilePicture || ''" alt="Profile Picture" class="h-24 w-24 rounded-full border-4 border-primary" />
          <div v-if="!profilePicture" class="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary text-2xl font-semibold text-foreground">
            {{ name.slice(0, 1) + surname.slice(0, 1) }}
          </div>
        </template>
        <template v-else>
          <img v-if="profilePicture" :src="profilePicture || ''" alt="Profile Picture" class="mr-5 size-12 rounded-full" />
          <input type="file" accept="image/*" @change="handleImageUpload" class="hover:file:bg-primary-dark block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white" />
        </template>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-foreground">Name</label>
        <Input v-model="name" :disabled="!isEditing" class="mt-1 bg-background text-foreground" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-foreground">Surname</label>
        <Input v-model="surname" :disabled="!isEditing" class="mt-1 bg-background text-foreground" />
      </div>

      <div class="flex flex-row items-center gap-2">
        <Button @click="discard" v-if="isEditing" class="mt-1 w-[40%] border-red-500 text-red-500 hover:bg-red-500 hover:text-white" variant="outline">Discard</Button>

        <Button @click="toggleEdit" :class="!isEditing ? 'border-primary text-primary hover:text-primary' : 'text-white'" class="mt-1 w-full" :variant="!isEditing ? 'outline' : ''" :disabled="isEditing && originalName?.trim() === name.trim() && originalSurname?.trim() === surname.trim() && originalProfilePicture?.trim() === profilePicture.trim()">
          {{ isEditing ? 'Save' : 'Edit' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'vue-sonner'

export default {
  data() {
    return {
      name: '',
      surname: '',
      profilePicture: '',
      originalName: '',
      originalSurname: '',
      originalProfilePicture: '',
      isEditing: false,
    }
  },
  computed: {
    user() {
      const userFromStore = this.$store && this.$store.state.user
      if (userFromStore) {
        return userFromStore
      } else {
        const userFromLocalStorage = JSON.parse(localStorage.getItem('user')) || {}
        return userFromLocalStorage
      }
    },
  },
  watch: {
    user(newUser) {
      if (newUser && Object.keys(newUser).length) {
        this.name = newUser.name || ''
        this.surname = newUser.surname || ''
        this.profilePicture = newUser.profilePicture || ''
      }
    },
  },
  methods: {
    discard() {
      this.name = this.originalName
      this.surname = this.originalSurname
      this.profilePicture = this.originalProfilePicture
      this.isEditing = false
    },
    toggleEdit() {
      if (this.isEditing) {
        this.saveChanges()
      }
      this.isEditing = !this.isEditing
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.profilePicture = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async saveChanges() {
      const userUid = this.user.uid || localStorage.getItem('uid')

      if (!userUid) {
        toast.error('User not found or missing UID')
        return
      }

      try {
        const userRef = doc(db, 'users', userUid)
        await updateDoc(userRef, {
          name: this.name,
          surname: this.surname,
          profilePicture: this.profilePicture,
        })

        this.$store.commit('updateUser', {
          ...this.user,
          name: this.name,
          surname: this.surname,
          profilePicture: this.profilePicture,
        })

        toast.success('Profile updated successfully!')
      } catch (error) {
        toast.error('Failed to update profile. Please try again.')
        console.error(error)
      }
    },
  },
  mounted() {
    const user = this.user
    if (user && Object.keys(user).length) {
      this.name = user.name || ''
      this.surname = user.surname || ''
      this.profilePicture = user.profilePicture || ''

      this.originalName = this.name
      this.originalSurname = this.surname
      this.originalProfilePicture = this.profilePicture
    }
  },
}
</script>

<script setup>
import Navbar from './dashboard/components/Navbar.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
</script>
