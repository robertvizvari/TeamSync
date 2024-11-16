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
            <input id="image" type="file" accept="image/*" @change="handleImageUpload" class="hover:file:bg-primary-dark block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white" />
          </div>
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="name" class="text-foreground">Name</Label>
          <Input v-model="name" id="name" class="text-foreground" placeholder="Important Project" maxlength="50" />
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="description" class="flex gap-1 text-foreground">
            Description
            <p class="mt-[-1px] text-xs text-muted-foreground">(optional)</p>
          </Label>
          <Textarea v-model="description" id="description" class="h-40 resize-none text-foreground" placeholder="This project is very important..." maxlength="500" />
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
          <TagsInput class="w-full text-foreground" v-model="inviteEmails">
            <TagsInputItem v-for="item in inviteEmails" :key="item" :value="item">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>

            <TagsInputInput id="invite" class="text-foreground" placeholder="teammate@email.com" />
          </TagsInput>
        </div>
      </div>
      <DialogFooter>
        <Button class="w-full text-white" :disabled="image == '' || name == ''" @click="createProject">Create project</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
import { db } from '@/firebase'
import { doc, setDoc, serverTimestamp, getDocs, collection, query, where } from 'firebase/firestore'
import { toast } from 'vue-sonner'

export default {
  data() {
    return {
      image: '',
      name: '',
      description: '',
      inviteEmails: [],
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async validateMembers(emails) {
      const validMembers = []
      for (const email of emails) {
        try {
          const userQuery = query(collection(db, 'users'), where('email', '==', email))
          const userSnapshot = await getDocs(userQuery)

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data()
            validMembers.push({ uid: userSnapshot.docs[0].id, email: userData.email })
          } else {
            toast.error(`User with email ${email} is not registered.`)
            return null
          }
        } catch (error) {
          console.error(`Error validating email ${email}:`, error)
          toast.error(`Failed to validate user ${email}.`)
          return null
        }
      }
      return validMembers
    },
    async createProject() {
      try {
        if (!this.name || !this.image) {
          toast.warning('Project name and image are required.')
          return
        }

        const validMembers = await this.validateMembers(this.inviteEmails)
        if (!validMembers) return

        const projectId = Date.now().toString()

        const projectData = {
          projectName: this.name,
          projectImage: this.image,
          description: this.description || '',
          createdBy: JSON.parse(localStorage.getItem('user')).uid,
          createdAt: serverTimestamp(),
          members: validMembers,
        }

        await setDoc(doc(db, 'projects', projectId), projectData)

        toast.success('Project created successfully!')
        this.$emit('project-created', projectId)

        this.image = ''
        this.name = ''
        this.description = ''
        this.inviteEmails = ''
      } catch (error) {
        console.error('Error creating project:', error)
        toast.error('Failed to create project. Please try again.')
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
