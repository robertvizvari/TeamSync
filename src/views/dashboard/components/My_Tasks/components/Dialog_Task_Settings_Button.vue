<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="w-fit" variant="ghost">
        <Edit class="size-5" />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <div class="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-left text-foreground">
            {{ $t('dialog_task_settings_button.dialog.editTaskTitle') }}
          </DialogTitle>
          <DialogDescription class="text-left">
            {{ $t('dialog_task_settings_button.dialog.editTaskDescription') }}
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-5 py-4">
          <div class="flex w-full flex-col gap-2">
            <Label for="name" class="text-foreground">{{ $t('dialog_task_settings_button.dialog.taskName.label') }}</Label>
            <Input v-model="name" :disabled="loading || !userIsCreator" id="name" class="text-foreground" :placeholder="$t('dialog_task_settings_button.dialog.taskName.placeholder')" maxlength="50" />
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label for="description" class="flex gap-1 text-foreground">
              {{ $t('dialog_task_settings_button.dialog.taskDescription.label') }}
              <p class="mt-[-1px] text-xs text-muted-foreground">{{ $t('dialog_task_settings_button.dialog.taskDescription.optionalText') }}</p>
            </Label>
            <Textarea v-model="description" :disabled="loading" id="description" class="h-32 resize-none text-foreground" :placeholder="$t('dialog_task_settings_button.dialog.taskDescription.placeholder')" maxlength="250" />
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label for="invite" class="text-sm text-foreground">{{ $t('dialog_task_settings_button.dialog.assignMembers.label') }}</Label>
            <ComboboxRoot v-model="assignMembers" v-model:search-term="searchTerm" multiple class="relative mx-auto w-full">
              <ComboboxAnchor class="inline-flex w-full items-center justify-between gap-[5px] rounded-lg border border-border bg-background p-2 text-[13px] leading-none text-foreground outline-none">
                <TagsInputRoot v-slot="{ modelValue: tags }" :model-value="assignMembers" delimiter="" class="flex flex-wrap items-center gap-2 rounded-lg">
                  <TagsInputItem v-for="item in tags" :key="item" :value="item" class="aria-[current=true]:bg-grass9 flex items-center justify-center gap-2 rounded bg-secondary px-2 py-1 text-foreground">
                    <TagsInputItemText class="text-sm" />
                    <TagsInputItemDelete>
                      <Icon icon="lucide:x" />
                    </TagsInputItemDelete>
                  </TagsInputItem>
                  <ComboboxInput as-child>
                    <TagsInputInput :placeholder="$t('dialog_task_settings_button.dialog.assignMembers.placeholder')" class="placeholder:text-mauve10 flex-1 rounded !bg-transparent px-1 focus:outline-none" @keydown.enter.prevent />
                  </ComboboxInput>
                </TagsInputRoot>
                <ComboboxTrigger>
                  <Icon icon="radix-icons:chevron-down" class="text-grass11 h-4 w-4" />
                </ComboboxTrigger>
              </ComboboxAnchor>
            </ComboboxRoot>
          </div>
          <div class="flex gap-2">
            <div class="flex w-full flex-col gap-2">
              <Label class="flex gap-1 text-foreground">{{ $t('dialog_task_settings_button.dialog.dueDate.label') }}</Label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" class="ps-3 text-start font-normal text-foreground sm:w-[250px]">
                    <span>{{ dueDate && newDueDate == '' ? dueDate : newDueDate }}</span>
                    <CalendarIcon v-if="dueDate == $t('dialog_task_settings_button.dialog.dueDate.pickDate') && !newDueDate" class="ms-auto h-4 w-4 opacity-50" :locale="locale" />
                    <X v-if="dueDate !== $t('dialog_task_settings_button.dialog.dueDate.pickDate') || newDueDate" @click="(dueDate = $t('dialog_task_settings_button.dialog.dueDate.pickDate')), (newDueDate = '')" class="ms-auto h-4 w-4 opacity-50 transition-all duration-300 hover:text-red-500" />
                  </Button>
                  <input hidden />
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="newDueDate" @click="dueDate = $t('dialog_task_settings_button.dialog.dueDate.pickDate')" :locale="locale" calendar-label="Date of birth" initial-focus />
                </PopoverContent>
              </Popover>
            </div>
            <div class="flex w-full flex-col gap-2">
              <Label class="flex gap-1 text-foreground">{{ $t('dialog_task_settings_button.dialog.state_basic') }}</Label>
              <div class="relative inline-block h-4">
                <Transition name="slide-up">
                  <Button class="absolute w-full text-white" v-if="state === 'todo'" @click="state = 'inProgress'">
                    {{ $t('dialog_task_settings_button.dialog.state.todo') }}
                  </Button>
                  <Button class="absolute w-full bg-amber-500 px-4 text-white hover:bg-amber-600" v-else-if="state === 'inProgress'" @click="state = 'finished'">
                    {{ $t('dialog_task_settings_button.dialog.state.inProgress') }}
                  </Button>
                  <Button class="absolute w-full bg-emerald-600 px-4 text-white hover:bg-emerald-700" v-else-if="state === 'finished'" @click="state = 'cancelled'">
                    {{ $t('dialog_task_settings_button.dialog.state.finished') }}
                  </Button>
                  <Button class="absolute w-full px-4 text-white" v-else-if="state === 'cancelled'" @click="state = 'todo'" variant="destructive">
                    {{ $t('dialog_task_settings_button.dialog.state.cancelled') }}
                  </Button>
                </Transition>
              </div>
            </div>
            <div class="flex w-full flex-col gap-2">
              <Label class="flex gap-1 text-foreground">{{ $t('dialog_task_settings_button.dialog.priority_basic') }}</Label>
              <div class="relative inline-block h-4">
                <Transition name="slide-up">
                  <Button class="absolute w-full bg-emerald-600 px-4 text-white hover:bg-emerald-700" v-if="priority === 'low'" @click="priority = 'medium'">
                    {{ $t('dialog_task_settings_button.dialog.priority.low') }}
                  </Button>
                  <Button class="absolute w-full bg-amber-500 px-4 text-white hover:bg-amber-600" v-else-if="priority === 'medium'" @click="priority = 'high'">
                    {{ $t('dialog_task_settings_button.dialog.priority.medium') }}
                  </Button>
                  <Button class="absolute w-full px-4 text-white" v-else-if="priority === 'high'" @click="priority = 'low'" variant="destructive">
                    {{ $t('dialog_task_settings_button.dialog.priority.high') }}
                  </Button>
                </Transition>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button v-if="userIsCreator" @click="showDialog = true" class="mt-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white sm:mt-0" variant="outline">
            {{ $t('dialog_task_settings_button.dialog.buttons.delete') }}
          </Button>
          <Button v-if="!loading" @click="editTask" :disabled="!isFormValid" class="w-full text-white">
            {{ $t('dialog_task_settings_button.dialog.buttons.edit') }}
          </Button>
          <Button v-if="loading" disabled class="w-full text-white">
            {{ $t('dialog_task_settings_button.dialog.buttons.edit') }}
            <RefreshCw class="mr-2 h-4 animate-spin" />
          </Button>
        </DialogFooter>

        <Transition name="fade">
          <div v-if="showDialog" @click="showDialog = false" class="pointer-events-auto fixed left-1/2 top-1/2 z-[9999] flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-60">
            <div class="pointer-events-auto grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
              <div class="flex flex-col gap-y-2 text-center sm:text-left">
                <h2 class="text-lg font-semibold text-foreground">{{ $t('dialog_task_settings_button.dialog.deleteDialog.confirmationTitle') }}</h2>
                <p class="text-sm text-muted-foreground">{{ $t('dialog_task_settings_button.dialog.deleteDialog.confirmationDescription') }}</p>
              </div>
              <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
                <Button @click="showDialog = false" class="mt-2 font-normal text-foreground sm:mt-0" size="sm" variant="outline">
                  {{ $t('dialog_task_settings_button.dialog.deleteDialog.cancelButton') }}
                </Button>
                <Button @click="deleteTask" class="bg-red-500 font-normal text-white hover:bg-red-400" size="sm">
                  {{ $t('dialog_task_settings_button.dialog.deleteDialog.confirmDeleteButton') }}
                </Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script>
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'vue-sonner'

export default {
  props: ['data', 'projects'],
  data() {
    return {
      name: '',
      description: '',
      assignMembers: [],
      state: 'todo',
      priority: 'medium',
      dueDate: '',
      loading: false,
      searchTerm: '',
      projectMembers: [],
      projectCreatedBy: [],
      originalData: {},
      showDialog: false,
      userIsCreator: false,
      newDueDate: '',
      locale: localStorage.getItem('locale') || 'en',
    }
  },
  methods: {
    async editTask() {
      if (!this.name.trim()) {
        toast.error(this.$t('dialog_task_settings_button.dialog.toasts.taskNameEmpty'))
        return
      }

      if (!this.data.id) {
        toast.error(this.$t('dialog_task_settings_button.dialog.toasts.invalidProjectId'))
        return
      }

      this.loading = true

      const membersList = Array.isArray(this.data.members) ? this.data.members : []
      const assignedEmails = Array.isArray(this.assignMembers) ? this.assignMembers : []

      const creatorEmail = this.projectCreatedBy[0].email
      const creatorUid = this.data.createdBy[0].uid
      const creatorName = this.data.createdBy[0].name
      const creatorSurname = this.data.createdBy[0].surname

      const validDueDate = this.dueDate === 'Pick a date' ? (this.newDueDate ? new Date(this.newDueDate).toISOString().split('T')[0] : null) : this.dueDate ? new Date(this.dueDate).toISOString().split('T')[0] : null

      const updatedMembers = assignedEmails.map((email) => {
        if (email === creatorEmail) {
          console.log(creatorUid, email, creatorName, creatorSurname)
          return { uid: creatorUid, email, name: creatorName, surname: creatorSurname }
        }
        const member = this.projectMembers.find((m) => m.email === email)
        return member ? { uid: member.uid, email: member.email, name: member.name, surname: member.surname } : { uid: null, email, name: null, surname: null }
      })

      const updatedTask = {
        ...this.data,
        name: this.name,
        description: this.description || '',
        members: updatedMembers,
        state: this.state,
        priority: this.priority,
        dueDate: validDueDate,
        updatedAt: serverTimestamp(),
      }

      const plainUpdatedTask = JSON.parse(JSON.stringify(updatedTask, (key, value) => (value === undefined ? null : value)))

      try {
        const projectRef = doc(db, 'projects', this.data.projectId)
        const projectSnap = await getDoc(projectRef)

        if (!projectSnap.exists()) {
          toast.error(this.$t('dialog_task_settings_button.dialog.toasts.projectDoesNotExist'))
          return
        }

        const projectData = projectSnap.data()

        const updatedTasks = projectData.tasks.map((task) => (task.id === this.data.id ? plainUpdatedTask : task))

        await updateDoc(projectRef, { tasks: updatedTasks })

        this.$emit('project-created')
        toast.success(this.$t('dialog_task_settings_button.dialog.toasts.taskUpdated'))
      } catch (error) {
        console.error('Error updating task:', error)
        toast.error(this.$t('dialog_task_settings_button.dialog.toasts.taskUpdateFailed'))
      } finally {
        this.loading = false
      }
    },

    async deleteTask() {
      if (!this.data.id) {
        toast.error(this.$t('dialog_task_settings_button.dialog.toasts.invalidTaskId'))
        return
      }

      try {
        this.loading = true

        const projectRef = doc(db, 'projects', this.data.projectId)
        const projectSnap = await getDoc(projectRef)

        if (!projectSnap.exists()) {
          toast.error(this.$t('dialog_task_settings_button.dialog.toasts.projectDoesNotExist'))
          return
        }

        const projectData = projectSnap.data()

        const updatedTasks = projectData.tasks.filter((task) => task.id !== this.data.id)

        await updateDoc(projectRef, {
          tasks: updatedTasks,
        })

        this.$emit('project-created')
        toast.success(this.$t('dialog_task_settings_button.dialog.toasts.taskDeleted'))
      } catch (error) {
        console.error('Error deleting task:', error)
        toast.error(this.$t('dialog_task_settings_button.dialog.toasts.taskDeleteFailed'))
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.userIsCreator = this.data.createdBy.uid === JSON.parse(localStorage.getItem('user')).uid

    this.name = this.data.name
    this.description = this.data.description

    const matchingProject = this.projects.find((project) => project.id === this.data.projectId)

    this.projectMembers = matchingProject ? matchingProject.members.filter((member) => member.state === 'accepted') : []
    this.projectCreatedBy = matchingProject ? matchingProject.createdBy : []

    this.assignMembers = this.data.members.map((member) => member.email)

    this.state = this.data.state
    this.priority = this.data.priority
    this.dueDate = this.data.dueDate
    this.loading = this.data.loading
    this.searchTerm = this.data.searchTerm

    this.originalData = {
      name: this.name,
      description: this.description,
      state: this.state,
      priority: this.priority,
      dueDate: this.dueDate,
      newDueDate: this.newDueDate,
      assignMembers: [...this.assignMembers],
    }
  },

  computed: {
    isFormValid() {
      return this.name.trim() !== '' && this.assignMembers.length > 0 && (this.name !== this.originalData.name || this.description !== this.originalData.description || this.state !== this.originalData.state || this.priority !== this.originalData.priority || this.dueDate !== this.originalData.dueDate || this.newDueDate !== this.originalData.newDueDate || JSON.stringify(this.assignMembers) !== JSON.stringify(this.originalData.assignMembers))
    },
  },
}
</script>

<script setup>
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'
import { RefreshCw, Edit } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ComboboxAnchor, ComboboxInput, ComboboxRoot, ComboboxTrigger, TagsInputRoot } from 'radix-vue'
import { Icon } from '@iconify/vue'
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
