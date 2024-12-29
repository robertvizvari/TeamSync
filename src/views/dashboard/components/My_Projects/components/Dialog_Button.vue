<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="text-muted-foreground" size="sm" variant="outline" :disabled="initialLoading">{{ $t('dialog_button.project.createProject') }}</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="text-foreground">{{ $t('dialog_button.project.createProject') }}</DialogTitle>
        <DialogDescription>{{ $t('dialog_button.project.projectDescription') }}</DialogDescription>
      </DialogHeader>
      <div class="grid gap-5 py-4">
        <div class="flex w-full flex-col gap-2">
          <Label for="image" class="text-foreground">{{ $t('dialog_button.project.image') }}</Label>
          <div class="flex items-center gap-5">
            <img v-if="image" :src="image || ''" class="h-12 w-12 rounded-full object-cover" />
            <input :disabled="loading" id="image" type="file" accept="image/*" @change="handleImageUpload" class="hover:file:bg-primary-dark block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white" />
          </div>
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="name" class="text-foreground">{{ $t('dialog_button.project.name') }}</Label>
          <Input v-model="name" :disabled="loading" id="name" class="text-foreground" :placeholder="$t('dialog_button.project.namePlaceholder')" maxlength="50" />
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="description" class="flex gap-1 text-foreground">
            {{ $t('dialog_button.project.description') }}
            <p class="mt-[-1px] text-xs text-muted-foreground">{{ $t('dialog_button.project.optional') }}</p>
          </Label>
          <Textarea v-model="description" :disabled="loading" id="description" class="h-40 resize-none text-foreground" :placeholder="$t('dialog_button.project.descriptionPlaceholder')" maxlength="500" />
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="invite" class="flex items-center gap-2 text-foreground">
            {{ $t('dialog_button.project.inviteTeammates') }}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <CircleHelp class="size-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent class="border-border">
                  <p class="text-center">
                    {{ $t('dialog_button.project.firstHalf') }}
                    <kbd class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100">Enter</kbd>
                    {{ $t('dialog_button.project.secondHalf') }}
                    <br />
                    {{ $t('dialog_button.project.please') }}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <TagsInput :disabled="loading" class="w-full text-foreground" v-model="inviteEmails">
            <TagsInputItem v-for="item in inviteEmails" :key="item" :value="item">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>

            <TagsInputInput id="invite" class="text-foreground" :placeholder="'teammate@email.com'" />
          </TagsInput>
        </div>
      </div>
      <DialogFooter>
        <Button v-if="!loading" class="w-full text-white" :disabled="image == '' || name == ''" @click="createProject">{{ $t('dialog_button.project.createProject_basic') }}</Button>
        <Button v-if="loading" disabled class="w-full text-white">
          {{ $t('dialog_button.project.createProject_basic') }}
          <RefreshCw class="mr-2 h-4 animate-spin" />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
import { db } from '@/firebase'
import { doc, setDoc, serverTimestamp, getDocs, collection, query, where } from 'firebase/firestore'
import { toast } from 'vue-sonner'
import emailjs from '@emailjs/browser'

export default {
  props: ['initialLoading'],
  data() {
    return {
      image: '',
      name: '',
      description: '',
      inviteEmails: [],
      loading: false,
      errorOccurred: false,
    }
  },
  methods: {
    async handleImageUpload(event) {
      const file = event.target.files[0]

      if (file && file.type.startsWith('image/')) {
        if (file.size > 1048487) {
          try {
            const compressedDataUrl = await this.compressImage(file, 800, 800)
            if (compressedDataUrl.length > 1048487) {
              toast.error(this.$t('dialog_button.project.toasts.toastErrorImageTooLarge'))
              return
            } else {
              this.image = compressedDataUrl
            }
          } catch (error) {
            console.error('Error compressing image:', error)
            toast.error(this.$t('dialog_button.project.toasts.toastErrorProcessingImage'))
          }
        } else {
          const reader = new FileReader()
          reader.onload = (e) => {
            this.image = e.target.result
          }
          reader.readAsDataURL(file)
        }
      } else {
        toast.error(this.$t('dialog_button.project.toasts.toastErrorInvalidFileType'))
      }
    },
    compressImage(file, maxWidth, maxHeight) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            let width = img.width
            let height = img.height

            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height = Math.floor((height * maxWidth) / width)
                width = maxWidth
              } else {
                width = Math.floor((width * maxHeight) / height)
                height = maxHeight
              }
            }

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)

            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8)

            resolve(resizedDataUrl)
          }

          img.onerror = () => reject(new Error('Failed to load image.'))
          img.src = e.target.result
        }

        reader.onerror = () => reject(new Error('Failed to read file.'))
        reader.readAsDataURL(file)
      })
    },
    async validateAndSendInvites(emails, projectId, projectName) {
      this.errorOccurred = false
      const validMembers = []
      const userEmail = JSON.parse(localStorage.getItem('user')).email

      for (const email of emails) {
        if (this.errorOccurred) break

        try {
          const trimmedEmail = email.trim()

          if (trimmedEmail === userEmail) {
            throw new Error("You can't add your own email.")
          }

          const userQuery = query(collection(db, 'users'), where('email', '==', trimmedEmail))
          const userSnapshot = await getDocs(userQuery)

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data()
            const inviteData = {
              uid: userSnapshot.docs[0].id,
              email: userData.email,
              name: userData.name || '',
              surname: userData.surname || '',
              state: 'pending',
            }

            validMembers.push(inviteData)

            const inviteLink = `https://teamsync-app.vercel.app/invite/${projectId}?email=${encodeURIComponent(trimmedEmail)}`

            await emailjs.send(
              import.meta.env.VITE_EMAILJS_SERVICE_ID,
              import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
              {
                to_email: trimmedEmail,
                project_name: projectName,
                invite_link: inviteLink,
              },
              import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )
          } else {
            setTimeout(() => {
              toast.error(this.$t('dialog_button.project.toasts.toastErrorInvalidFileType'))
            }, 1000)
            this.errorOccurred = true
            throw new Error(`User with email ${trimmedEmail} is not registered.`)
          }
        } catch (error) {
          this.errorOccurred = true
          this.loading = false
          console.error(`Error validating or sending email to ${email}:`, error)
          throw new Error(error.message || `Failed to validate or send invite to ${email}.`)
        }
      }
      return validMembers
    },

    async createProject() {
      this.loading = true
      this.errorOccurred = false

      try {
        if (!this.name || !this.image) {
          toast.warning(this.$t('dialog_button.project.toasts.toastErrorMissingInfo'))
          return
        }

        if (this.errorOccurred) return

        const userId = JSON.parse(localStorage.getItem('user')).uid
        const userEmail = JSON.parse(localStorage.getItem('user')).email
        const userName = JSON.parse(localStorage.getItem('user')).name
        const userSurname = JSON.parse(localStorage.getItem('user')).surname
        const projectId = Date.now().toString()

        let validMembers
        try {
          validMembers = await this.validateAndSendInvites(this.inviteEmails, projectId, this.name)
        } catch (error) {
          toast.error(error.message || this.$t('dialog_button.project.toasts.toastErrorSendInvites'))
          this.errorOccurred = true
          this.loading = false
          return
        }

        try {
          const projectData = {
            projectName: this.name,
            projectImage: this.image,
            description: this.description || '',
            createdBy: [{ uid: userId, email: userEmail, name: userName, surname: userSurname }],
            createdAt: serverTimestamp(),
            members: validMembers,
          }

          await setDoc(doc(db, 'projects', projectId), projectData)
        } catch (error) {
          this.errorOccurred = true
          console.error('Error creating project:', error)
          toast.error(this.$t('dialog_button.project.toasts.toastErrorProjectCreation'))
          return
        }

        this.$emit('project-created', projectId)

        this.image = ''
        this.name = ''
        this.description = ''
        this.inviteEmails = []
        this.loading = false
      } catch (error) {
        this.errorOccurred = true
        console.error('Unexpected error during project creation:', error)
        toast.error(this.$t('dialog_button.project.toasts.toastErrorUnexpected'))
        this.loading = false
      }
    },
  },
}
</script>

<script setup>
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CircleHelp, RefreshCw } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
</script>
