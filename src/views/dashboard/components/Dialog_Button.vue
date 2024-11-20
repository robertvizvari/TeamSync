<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="text-muted-foreground" size="sm" variant="outline">Create a project</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="text-foreground">Create a project</DialogTitle>
        <DialogDescription>Work with your team to plan, create, and achieve your goals together.</DialogDescription>
      </DialogHeader>
      <div class="grid gap-5 py-4">
        <div class="flex w-full flex-col gap-2">
          <Label for="image" class="text-foreground">Image</Label>
          <div class="flex items-center gap-5">
            <img v-if="image" :src="image || ''" class="h-12 w-12 rounded-full object-cover" />
            <input :disabled="loading" id="image" type="file" accept="image/*" @change="handleImageUpload" class="hover:file:bg-primary-dark block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white" />
          </div>
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="name" class="text-foreground">Name</Label>
          <Input v-model="name" :disabled="loading" id="name" class="text-foreground" placeholder="Important Project" maxlength="50" />
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="description" class="flex gap-1 text-foreground">
            Description
            <p class="mt-[-1px] text-xs text-muted-foreground">(optional)</p>
          </Label>
          <Textarea v-model="description" :disabled="loading" id="description" class="h-40 resize-none text-foreground" placeholder="This project is very important..." maxlength="500" />
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="invite" class="flex items-center gap-2 text-foreground">
            Invite your teammates
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Icon icon="radix-icons:question-mark-circled" class="size-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent class="border-border">
                  <p class="text-center">
                    After entering the correct email address, press
                    <kbd class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100">Enter</kbd>
                    to add another one.
                    <br />
                    Please do not enter multiple addresses in a single field.
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

            <TagsInputInput id="invite" class="text-foreground" placeholder="teammate@email.com" />
          </TagsInput>
        </div>
      </div>
      <DialogFooter>
        <Button v-if="!loading" class="w-full text-white" :disabled="image == '' || name == ''" @click="createProject">Create project</Button>
        <Button v-if="loading" disabled class="w-full text-white">
          <Icon class="mr-2 animate-spin" icon="radix-icons:symbol" />
          Create project
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
  data() {
    return {
      image: '',
      name: '',
      description: '',
      inviteEmails: [],
      loading: false,
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
              toast.error('Compressed image is still too large. Please choose a smaller image.')
              return
            } else {
              this.image = compressedDataUrl
            }
          } catch (error) {
            console.error('Error compressing image:', error)
            toast.error('Failed to process the image. Please try again.')
          }
        } else {
          const reader = new FileReader()
          reader.onload = (e) => {
            this.image = e.target.result
          }
          reader.readAsDataURL(file)
        }
      } else {
        toast.error('Invalid file type. Please upload an image.')
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
      const validMembers = []
      for (const email of emails) {
        try {
          const trimmedEmail = email.trim()
          const userQuery = query(collection(db, 'users'), where('email', '==', trimmedEmail))
          const userSnapshot = await getDocs(userQuery)

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data()
            const inviteData = {
              uid: userSnapshot.docs[0].id,
              email: userData.email,
              state: 'pending',
            }

            validMembers.push(inviteData)

            // const inviteLink = `https://teamsync-app.vercel.app/invite/${projectId}?email=${encodeURIComponent(trimmedEmail)}`
            const inviteLink = `http://localhost:5173/invite/${projectId}?email=${encodeURIComponent(trimmedEmail)}`

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
            toast.error(`User with email ${trimmedEmail} is not registered.`)
          }
        } catch (error) {
          console.error(`Error validating or sending email to ${email}:`, error)
          throw new Error(`Failed to validate or send invite to ${email}.`)
        }
      }
      return validMembers
    },
    async createProject() {
      this.loading = true

      try {
        if (!this.name || !this.image) {
          toast.warning('Project name and image are required.')
          return
        }

        const userId = JSON.parse(localStorage.getItem('user')).uid
        const userEmail = JSON.parse(localStorage.getItem('user')).email
        const projectId = Date.now().toString()

        let validMembers
        try {
          validMembers = await this.validateAndSendInvites(this.inviteEmails, projectId, this.name)
        } catch (error) {
          toast.error('Failed to send invites. Aborting project creation.')
          return
        }

        try {
          const projectData = {
            projectName: this.name,
            projectImage: this.image,
            description: this.description || '',
            createdBy: [{ uid: userId, email: userEmail }],
            createdAt: serverTimestamp(),
            members: validMembers,
          }

          await setDoc(doc(db, 'projects', projectId), projectData)
        } catch (error) {
          console.error('Error creating project:', error)
          toast.error('Failed to create project. Please try again.')
          return
        }

        toast.success('Project created successfully!')
        this.$emit('project-created', projectId)

        this.image = ''
        this.name = ''
        this.description = ''
        this.inviteEmails = []
        this.loading = false
      } catch (error) {
        console.error('Unexpected error during project creation:', error)
        toast.error('An unexpected error occurred. Please try again.')
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
import { Icon } from '@iconify/vue'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
</script>
