<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="w-full border-primary text-primary hover:text-primary" size="sm" variant="outline">{{ $t('dialog_task_button.tasks.addTask') }}</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="text-foreground">{{ $t('dialog_task_button.tasks.addTask') }}</DialogTitle>
        <DialogDescription>{{ $t('dialog_task_button.tasks.taskDescrpition') }}</DialogDescription>
      </DialogHeader>
      <div class="grid gap-5 py-4">
        <div class="flex w-full flex-col gap-2">
          <Label for="name" class="text-foreground">{{ $t('dialog_task_button.tasks.name') }}</Label>
          <Input v-model="name" :disabled="loading" id="name" class="text-foreground" :placeholder="$t('dialog_task_button.tasks.namePlaceholder')" :maxlength="50" />
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="description" class="flex gap-1 text-foreground">
            {{ $t('dialog_task_button.tasks.description') }}
            <p class="mt-[-1px] text-xs text-muted-foreground">{{ $t('dialog_task_button.tasks.optional') }}</p>
          </Label>
          <Textarea v-model="description" :disabled="loading" id="description" class="h-32 resize-none text-foreground" :placeholder="$t('dialog_task_button.tasks.descriptionPlaceholder')" maxlength="250" />
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="invite" class="text-sm text-foreground">{{ $t('dialog_task_button.tasks.assignMembers') }}</Label>
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
                  <TagsInputInput :placeholder="$t('dialog_task_button.tasks.members')" class="placeholder:text-mauve10 flex-1 rounded !bg-transparent px-1 focus:outline-none" @keydown.enter.prevent />
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
                  <ComboboxLabel class="px-[25px] text-xs leading-[25px] text-muted-foreground">{{ $t('dialog_task_button.tasks.members_basic') }}</ComboboxLabel>

                  <ComboboxItem class="relative flex h-[25px] cursor-pointer select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-foreground data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[highlighted]:text-foreground data-[highlighted]:outline-none" :value="data.createdBy[0].email">
                    <ComboboxItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
                      <Icon icon="radix-icons:check" />
                    </ComboboxItemIndicator>
                    <span>
                      {{ data.createdBy[0].name + ' ' + data.createdBy[0].surname }}
                      <span class="text-xs text-muted-foreground">
                        {{ data.createdBy[0].email }}
                      </span>
                    </span>
                  </ComboboxItem>
                  <ComboboxItem v-for="(member, index) in acceptedMembers" :key="index" class="relative flex h-[25px] cursor-pointer select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-foreground data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[highlighted]:text-foreground data-[highlighted]:outline-none" :value="member.email">
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
            <Label class="flex gap-1 text-foreground">{{ $t('dialog_task_button.tasks.dueDate') }}</Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" class="ps-3 text-start font-normal text-foreground sm:w-[250px]">
                  <span>{{ dueDate ? dueDate : $t('dialog_task_button.tasks.pick_a_date') }}</span>
                  <CalendarIcon v-if="!dueDate" :locale="locale" class="ms-auto h-4 w-4 opacity-50" />
                  <X v-if="dueDate" @click="dueDate = ''" class="ms-auto h-4 w-4 opacity-50 transition-all duration-300 hover:text-red-500" />
                </Button>
                <input hidden />
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar v-model="dueDate" :locale="locale" calendar-label="Date of birth" initial-focus />
              </PopoverContent>
            </Popover>
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label class="flex gap-1 text-foreground">{{ $t('dialog_task_button.tasks.state') }}</Label>
            <div class="relative inline-block h-4">
              <Transition name="slide-up">
                <Button class="absolute w-full text-white" v-if="state === 'todo'" @click="state = 'inProgress'">{{ $t('dialog_task_button.tasks.stateLabels.todo') }}</Button>
                <Button class="absolute w-full bg-amber-500 px-4 text-white hover:bg-amber-600" v-else-if="state === 'inProgress'" @click="state = 'finished'">{{ $t('dialog_task_button.tasks.stateLabels.inProgress') }}</Button>
                <Button class="absolute w-full bg-emerald-600 px-4 text-white hover:bg-emerald-700" v-else-if="state === 'finished'" @click="state = 'cancelled'">{{ $t('dialog_task_button.tasks.stateLabels.finished') }}</Button>
                <Button class="absolute w-full px-4 text-white" v-else-if="state === 'cancelled'" @click="state = 'todo'" variant="destructive">{{ $t('dialog_task_button.tasks.stateLabels.cancelled') }}</Button>
              </Transition>
            </div>
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label class="flex gap-1 text-foreground">{{ $t('dialog_task_button.tasks.priority') }}</Label>
            <div class="relative inline-block h-4">
              <Transition name="slide-up">
                <Button class="absolute w-full bg-emerald-600 px-4 text-white hover:bg-emerald-700" v-if="priority === 'low'" @click="priority = 'medium'">{{ $t('dialog_task_button.tasks.priorityLabels.low') }}</Button>
                <Button class="absolute w-full bg-amber-500 px-4 text-white hover:bg-amber-600" v-else-if="priority === 'medium'" @click="priority = 'high'">{{ $t('dialog_task_button.tasks.priorityLabels.medium') }}</Button>
                <Button class="absolute w-full px-4 text-white" v-else-if="priority === 'high'" @click="priority = 'low'" variant="destructive">{{ $t('dialog_task_button.tasks.priorityLabels.high') }}</Button>
              </Transition>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button v-if="!loading" @click="addTask" class="w-full text-white" :disabled="name == '' || assignMembers == [] || assignMembers.length < 1">{{ $t('dialog_task_button.tasks.addTask') }}</Button>
        <Button v-if="loading" disabled class="w-full text-white">
          {{ $t('dialog_task_button.tasks.addTask') }}
          <RefreshCw class="mr-2 h-4 animate-spin" />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'vue-sonner'

export default {
  props: ['data'],
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
      locale: localStorage.getItem('locale') || 'en',
    }
  },
  methods: {
    async addTask() {
      if (!this.name.trim()) {
        toast.error(this.$t('dialog_task_button.tasks.toasts.toastErrorNameEmpty'))
        return
      }

      if (!this.data.id) {
        toast.error(this.$t('dialog_task_button.tasks.toasts.toastErrorInvalidProjectID'))
        return
      }

      this.loading = true

      const membersList = Array.isArray(this.data.members) ? this.data.members : []
      const assignedEmails = Array.isArray(this.assignMembers) ? this.assignMembers : []

      const creatorEmail = this.data.createdBy[0].email
      const creatorUid = this.data.createdBy[0].uid
      const creatorName = this.data.createdBy[0].name
      const creatorSurname = this.data.createdBy[0].surname

      const validDueDate = this.dueDate && this.dueDate instanceof Date && !isNaN(this.dueDate) ? this.dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

      const task = {
        id: Date.now().toString(),
        name: this.name,
        description: this.description || '',
        createdBy: {
          uid: this.data.createdBy[0].uid,
          email: creatorEmail,
          name: creatorName,
          surname: creatorSurname,
        },
        members: assignedEmails.map((email) => {
          if (email === creatorEmail) {
            return { uid: creatorUid, email, name: creatorName, surname: creatorSurname }
          }
          const member = membersList.find((m) => m.email === email)
          return member ? { uid: member.uid, email: member.email, name: member.name, surname: member.surname } : { uid: null, email, name: null, surname: null }
        }),
        state: this.state,
        priority: this.priority,
        dueDate: validDueDate,
        createdAt: setTimeout(() => {
          Date.now()
        }, 100),
      }

      const plainTask = JSON.parse(JSON.stringify(task))

      try {
        const projectRef = doc(db, 'projects', this.data.id)
        await updateDoc(projectRef, {
          tasks: arrayUnion(plainTask),
        })

        this.$emit('project-created')
        this.resetForm()
      } catch (error) {
        console.error('Error adding task:', error)
        toast.error(this.$t('dialog_task_button.tasks.toasts.toastErrorAdding'))
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.name = ''
      this.description = ''
      this.assignMembers = []
      this.state = 'todo'
      this.priority = 'medium'
      this.dueDate = ''
    },
  },
  computed: {
    acceptedMembers() {
      return this.data.members.filter((member) => member.state === 'accepted')
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
import { RefreshCw } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
</style>
