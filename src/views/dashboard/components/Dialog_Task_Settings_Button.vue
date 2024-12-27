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
          <DialogTitle class="text-left text-foreground">Edit task</DialogTitle>
          <DialogDescription class="text-left">Work with your team to assign tasks and stay on track toward your goals.</DialogDescription>
        </DialogHeader>
        <div class="grid gap-5 py-4">
          <div class="flex w-full flex-col gap-2">
            <Label for="name" class="text-foreground">Name</Label>
            <Input v-model="name" :disabled="loading || !userIsCreator" id="name" class="text-foreground" placeholder="Important task" maxlength="50" />
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label for="description" class="flex gap-1 text-foreground">
              Description
              <p class="mt-[-1px] text-xs text-muted-foreground">(optional)</p>
            </Label>
            <Textarea v-model="description" :disabled="loading" id="description" class="h-32 resize-none text-foreground" placeholder="This task is very important..." maxlength="250" />
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label for="invite" class="text-sm text-foreground">Assign members</Label>
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
                    <TagsInputInput placeholder="Members..." class="placeholder:text-mauve10 flex-1 rounded !bg-transparent px-1 focus:outline-none" @keydown.enter.prevent />
                  </ComboboxInput>
                </TagsInputRoot>

                <ComboboxTrigger>
                  <Icon icon="radix-icons:chevron-down" class="text-grass11 h-4 w-4" />
                </ComboboxTrigger>
              </ComboboxAnchor>
              <ComboboxContent class="absolute z-10 mt-2 w-full overflow-hidden rounded border border-border bg-background shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]">
                <ComboboxViewport class="p-[5px]">
                  <ComboboxEmpty class="py-2 text-center text-xs font-medium text-gray-400" />

                  <ComboboxGroup>
                    <ComboboxLabel class="px-[25px] text-xs leading-[25px] text-muted-foreground">Members</ComboboxLabel>
                    <ComboboxItem class="relative flex h-[25px] cursor-pointer select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-foreground data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[highlighted]:text-foreground data-[highlighted]:outline-none" :value="projectCreatedBy[0].email">
                      <ComboboxItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
                        <Icon icon="radix-icons:check" />
                      </ComboboxItemIndicator>
                      <span>
                        {{ projectCreatedBy[0].name + ' ' + projectCreatedBy[0].surname }}
                        <span class="text-xs text-muted-foreground">
                          {{ projectCreatedBy[0].email }}
                        </span>
                      </span>
                    </ComboboxItem>
                    <ComboboxItem v-for="(member, index) in projectMembers" :key="index" class="relative flex h-[25px] cursor-pointer select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-foreground data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[highlighted]:text-foreground data-[highlighted]:outline-none" :value="member.email">
                      <ComboboxItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
                        <Icon icon="radix-icons:check" />
                      </ComboboxItemIndicator>
                      <span>
                        {{ member.name + ' ' + member.surname }}
                        <span class="text-xs text-muted-foreground">
                          {{ member.email }}
                        </span>
                      </span>
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxViewport>
              </ComboboxContent>
            </ComboboxRoot>
          </div>
          <div class="flex gap-2">
            <div class="flex w-full flex-col gap-2">
              <Label class="flex gap-1 text-foreground">Due date</Label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" class="ps-3 text-start font-normal text-foreground sm:w-[250px]">
                    <span>{{ dueDate && newDueDate == '' ? dueDate : newDueDate }}</span>
                    <CalendarIcon v-if="dueDate == 'Pick a date' && !newDueDate" class="ms-auto h-4 w-4 opacity-50" />
                    <X v-if="dueDate !== 'Pick a date' || newDueDate" @click="(dueDate = 'Pick a date'), (newDueDate = '')" class="ms-auto h-4 w-4 opacity-50 transition-all duration-300 hover:text-red-500" />
                  </Button>
                  <input hidden />
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="newDueDate" @click="dueDate = 'Pick a date'" calendar-label="Date of birth" initial-focus />
                </PopoverContent>
              </Popover>
            </div>
            <div class="flex w-full flex-col gap-2">
              <Label class="flex gap-1 text-foreground">State</Label>
              <div class="relative inline-block h-4">
                <Transition name="slide-up">
                  <Button class="absolute w-full text-white" v-if="state === 'todo'" @click="state = 'inProgress'">To do</Button>
                  <Button class="absolute w-full bg-amber-500 px-4 text-white hover:bg-amber-600" v-else-if="state === 'inProgress'" @click="state = 'finished'">In progress</Button>
                  <Button class="absolute w-full bg-emerald-600 px-4 text-white hover:bg-emerald-700" v-else-if="state === 'finished'" @click="state = 'cancelled'">Finished</Button>
                  <Button class="absolute w-full px-4 text-white" v-else-if="state === 'cancelled'" @click="state = 'todo'" variant="destructive">Cancelled</Button>
                </Transition>
              </div>
            </div>
            <div class="flex w-full flex-col gap-2">
              <Label class="flex gap-1 text-foreground">Priority</Label>
              <div class="relative inline-block h-4">
                <Transition name="slide-up">
                  <Button class="absolute w-full bg-emerald-600 px-4 text-white hover:bg-emerald-700" v-if="priority === 'low'" @click="priority = 'medium'">Low</Button>
                  <Button class="absolute w-full bg-amber-500 px-4 text-white hover:bg-amber-600" v-else-if="priority === 'medium'" @click="priority = 'high'">Meduim</Button>
                  <Button class="absolute w-full px-4 text-white" v-else-if="priority === 'high'" @click="priority = 'low'" variant="destructive">High</Button>
                </Transition>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button v-if="userIsCreator" @click="showDialog = true" class="mt-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white sm:mt-0" variant="outline">Delete</Button>
          <Button v-if="!loading" @click="editTask" :disabled="!isFormValid" class="w-full text-white">Edit task</Button>
          <Button v-if="loading" disabled class="w-full text-white">
            Edit task
            <RefreshCw class="mr-2 h-4 animate-spin" />
          </Button>
        </DialogFooter>

        <Transition name="fade">
          <div v-if="showDialog" @click="showDialog = false" class="pointer-events-auto fixed left-1/2 top-1/2 z-[9999] flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-60">
            <div class="pointer-events-auto grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
              <div class="flex flex-col gap-y-2 text-center sm:text-left">
                <h2 class="text-lg font-semibold text-foreground">Are you absolutely sure?</h2>
                <p class="text-sm text-muted-foreground">Are you sure you want to delete this task? This action cannot be undone.</p>
              </div>
              <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
                <Button @click="showDialog = false" class="mt-2 font-normal text-foreground sm:mt-0" size="sm" variant="outline">Cancel</Button>
                <Button @click="deleteTask" class="bg-red-500 font-normal text-white hover:bg-red-400" size="sm">Delete</Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script>
import { doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'vue-sonner'
import { set } from '@vueuse/core'

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
    }
  },
  methods: {
    async editTask() {
      if (!this.name.trim()) {
        toast.error('Task name cannot be empty.')
        return
      }

      if (!this.data.id) {
        toast.error('Invalid project ID. Cannot edit the task.')
        return
      }

      this.loading = true

      const membersList = Array.isArray(this.data.members) ? this.data.members : []
      const assignedEmails = Array.isArray(this.assignMembers) ? this.assignMembers : []

      const creatorEmail = this.projectCreatedBy[0].email
      const creatorUid = JSON.parse(localStorage.getItem('user')).uid
      const creatorName = JSON.parse(localStorage.getItem('user')).name
      const creatorSurname = JSON.parse(localStorage.getItem('user')).surname

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
          toast.error('Project does not exist.')
          return
        }

        const projectData = projectSnap.data()

        const updatedTasks = projectData.tasks.map((task) => (task.id === this.data.id ? plainUpdatedTask : task))

        await updateDoc(projectRef, { tasks: updatedTasks })

        this.$emit('project-created')
        toast.success('Task updated successfully.')
      } catch (error) {
        console.error('Error updating task:', error)
        toast.error('Failed to update the task. Please try again.')
      } finally {
        this.loading = false
      }
    },

    async deleteTask() {
      if (!this.data.id) {
        toast.error('Invalid task ID. Cannot delete the task.')
        return
      }

      try {
        this.loading = true

        const projectRef = doc(db, 'projects', this.data.projectId)
        const projectSnap = await getDoc(projectRef)

        if (!projectSnap.exists()) {
          toast.error('Project does not exist.')
          return
        }

        const projectData = projectSnap.data()

        const updatedTasks = projectData.tasks.filter((task) => task.id !== this.data.id)

        await updateDoc(projectRef, {
          tasks: updatedTasks,
        })

        this.$emit('project-created')
        toast.success('Task deleted successfully.')
      } catch (error) {
        console.error('Error deleting task:', error)
        toast.error('Failed to delete the task. Please try again.')
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
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'
import { CircleHelp, RefreshCw, Edit } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ref, watch } from 'vue'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxLabel, ComboboxRoot, ComboboxTrigger, ComboboxViewport, TagsInputRoot } from 'radix-vue'
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
