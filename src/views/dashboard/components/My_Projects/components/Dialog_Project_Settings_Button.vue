<template>
  <Dialog>
    <DialogTrigger as-child>
      <Settings class="size-5 cursor-pointer text-muted-foreground transition-all duration-300 hover:rotate-90 hover:text-foreground" />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <div class="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-left text-foreground">{{ $t('dialog_project_settings_button.project.editProject') }}</DialogTitle>
          <DialogDescription class="text-left">{{ $t('dialog_project_settings_button.project.projectDescription') }}</DialogDescription>
        </DialogHeader>
        <div class="grid gap-5 py-4">
          <div class="flex w-full flex-col gap-2">
            <Label for="image" class="text-foreground">{{ $t('dialog_project_settings_button.project.image') }}</Label>
            <div class="flex items-center gap-5">
              <img v-if="image" :src="image || ''" class="h-12 w-12 rounded-full object-cover" />
              <input :disabled="loading" id="image" type="file" accept="image/*" @change="handleImageUpload" class="hover:file:bg-primary-dark block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white" />
            </div>
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label for="name" class="text-foreground">{{ $t('dialog_project_settings_button.project.name') }}</Label>
            <Input v-model="name" :disabled="loading" id="name" class="text-foreground" :placeholder="$t('dialog_project_settings_button.project.namePlaceholder')" maxlength="50" />
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label for="description" class="flex gap-1 text-foreground">
              {{ $t('dialog_project_settings_button.project.description') }}
              <p class="mt-[-1px] text-xs text-muted-foreground">{{ $t('dialog_project_settings_button.project.optional') }}</p>
            </Label>
            <Textarea v-model="description" :disabled="loading" id="description" class="h-40 resize-none text-foreground" :placeholder="$t('dialog_project_settings_button.project.descriptionPlaceholder')" maxlength="500" />
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label for="invite" class="flex items-center gap-2 text-foreground">
              {{ $t('dialog_project_settings_button.project.inviteTeammates') }}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <CircleHelp class="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent class="border-border">
                    <p class="text-center">
                      {{ $t('dialog_project_settings_button.project.firstHalf') }}
                      <kbd class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100">Enter</kbd>
                      {{ $t('dialog_project_settings_button.project.secondHalf') }}
                      <br />
                      {{ $t('dialog_project_settings_button.project.please') }}
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
          <Button @click="showDialog = true" :disabled="loading" class="mt-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white sm:mt-0" variant="outline">{{ $t('dialog_project_settings_button.project.deleteProject') }}</Button>
          <Button v-if="!loading" class="w-full text-white" :disabled="!hasChanges || loading || image === '' || name.trim() === ''" @click="saveChanges">{{ $t('dialog_project_settings_button.project.editProject_basic') }}</Button>
          <Button v-if="loading" disabled class="w-full text-white">
            {{ $t('dialog_project_settings_button.project.editProject_basic') }}
            <RefreshCw class="mr-2 h-4 animate-spin" />
          </Button>
        </DialogFooter>

        <Transition name="fade">
          <div v-if="showDialog" @click="showDialog = false" class="pointer-events-auto fixed left-1/2 top-1/2 z-[9999] flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-60">
            <div class="pointer-events-auto grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
              <div class="flex flex-col gap-y-2 text-center sm:text-left">
                <h2 class="text-lg font-semibold text-foreground">{{ $t('dialog_project_settings_button.project.confirmation.title') }}</h2>
                <p class="text-sm text-muted-foreground">{{ $t('dialog_project_settings_button.project.confirmation.description') }}</p>
              </div>
              <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
                <Button @click="showDialog = false" class="mt-2 font-normal text-foreground sm:mt-0" size="sm" variant="outline">{{ $t('dialog_project_settings_button.project.confirmation.cancel') }}</Button>
                <Button @click="deleteProject" class="bg-red-500 font-normal text-white hover:bg-red-400" size="sm">{{ $t('dialog_project_settings_button.project.confirmation.confirm') }}</Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script>
import { db } from '@/firebase'
import { doc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { toast } from 'vue-sonner'
import emailjs from '@emailjs/browser'

export default {
  props: ['data'],
  data() {
    return {
      image: '',
      name: '',
      description: '',
      inviteEmails: [],
      pendingEmails: [],
      loading: false,
      showDialog: false,
    }
  },
  mounted() {
    this.image = this.data.projectImage
    this.name = this.data.projectName
    this.description = this.data.description

    this.inviteEmails = this.data.members.filter((member) => member.state === 'accepted').map((member) => member.email)

    this.pendingEmails = this.data.members.filter((member) => member.state === 'pending').map((member) => member.email)
  },
  methods: {
    async saveChanges() {
      this.loading = true

      try {
        const projectId = this.data.id
        const projectName = this.name
        const projectDocRef = doc(db, 'projects', projectId)

        const createdByEmail = this.data.createdBy[0].email
        if (this.inviteEmails.includes(createdByEmail)) {
          setTimeout(() => {
            toast.error(this.$t('dialog_project_settings_button.project.toasts.toastErrorOwnEmail'))
          }, 500)
          throw new Error("You can't add your own email.")
        }

        const currentEmails = this.data.members.filter((member) => member.state === 'accepted').map((member) => member.email)
        const newInviteEmails = this.inviteEmails.filter((email) => !currentEmails.includes(email))
        const removedEmails = currentEmails.filter((email) => !this.inviteEmails.includes(email))

        for (const removedEmail of removedEmails) {
          const memberToDecline = this.data.members.find((member) => member.email === removedEmail)
          if (memberToDecline) {
            await updateDoc(projectDocRef, {
              members: arrayRemove({ ...memberToDecline, state: 'accepted' }),
            })
            await updateDoc(projectDocRef, {
              members: arrayUnion({ ...memberToDecline, state: 'declined' }),
            })
          }
        }

        if (newInviteEmails.length > 0) {
          const validInvites = await this.validateAndSendInvites(newInviteEmails, projectId, projectName)
          for (const invite of validInvites) {
            await updateDoc(projectDocRef, {
              members: arrayUnion(invite),
            })
          }
        }

        const updates = {
          projectName: this.name,
          projectImage: this.image,
          description: this.description,
          updatedAt: serverTimestamp(),
        }

        await updateDoc(projectDocRef, updates)
        this.$emit('project-created', projectId)
        toast.success(this.$t('dialog_project_settings_button.project.toasts.projectUpdated'))
      } catch (error) {
        console.error('Error updating project:', error)
        if (error.message === "You can't add your own email.") {
          toast.error(this.$t('dialog_project_settings_button.project.toasts.toastErrorOwnEmail'))
        } else {
          toast.error(this.$t('dialog_project_settings_button.project.toasts.toastErrorFailedToUpdate'))
        }
      } finally {
        this.loading = false
      }
    },

    async validateAndSendInvites(emails, projectId, projectName) {
      const validMembers = []
      for (const email of emails) {
        try {
          const trimmedEmail = email.trim()

          if (this.pendingEmails.includes(trimmedEmail)) {
            setTimeout(() => {
              toast.error(
                this.$t('dialog_project_settings_button.project.toasts.toastErrorEmailPending', {
                  trimmedEmail: trimmedEmail,
                })
              )
            }, 500)
            throw new Error(`${trimmedEmail} invitation is already pending.`)
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
              toast.error(this.$t('dialog_project_settings_button.project.toasts.toastErrorInvalidEmail'), {
                trimmedEmail: trimmedEmail,
              })
            }, 500)
            throw new Error(`Invalid email: ${trimmedEmail}`)
          }
        } catch (error) {
          console.error(`Error validating or sending email to ${email}:`, error)
          throw new Error(`Failed to validate or send invite to ${email}.`)
        }
      }
      return validMembers
    },

    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          this.image = reader.result
        }
        reader.readAsDataURL(file)
      }
    },

    async deleteProject() {
      this.loading = true
      try {
        const projectId = this.data.id
        const projectDocRef = doc(db, 'projects', projectId)

        await deleteDoc(projectDocRef)

        this.$emit('project-created', projectId)

        this.showDialog = false

        toast.success(this.$t('dialog_project_settings_button.project.toasts.projectDeleted'))
      } catch (error) {
        console.error('Error deleting project:', error)
        toast.error(this.$t('dialog_project_settings_button.project.toasts.toastErrorFailedToDelete'))
      } finally {
        this.loading = false
      }
    },

    arraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false
      return arr1.every((item) => arr2.includes(item)) && arr2.every((item) => arr1.includes(item))
    },
  },
  computed: {
    hasChanges() {
      const hasImageChanged = this.image !== this.data.projectImage
      const hasNameChanged = this.name.trim() !== this.data.projectName.trim()
      const hasDescriptionChanged = this.description.trim() !== this.data.description.trim()
      const hasInviteEmailsChanged = !this.arraysEqual(
        this.inviteEmails,
        this.data.members.filter((member) => member.state === 'accepted').map((member) => member.email)
      )

      return hasImageChanged || hasNameChanged || hasDescriptionChanged || hasInviteEmailsChanged
    },
  },
}
</script>

<script setup>
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CircleHelp, RefreshCw, Settings } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
