<template>
  <Dialog>
    <div class="flex flex-row items-center gap-5 rounded-lg border border-border p-4 text-foreground">
      <div>
        <Checkbox />
      </div>
      <DialogTrigger as-child>
        <div class="flex w-full cursor-pointer flex-col">
          <div class="text-[1rem] font-semibold">
            {{ data.name }}
          </div>
          <div class="text-sm">Project: {{ data.projectName }}</div>
          <div class="text-sm text-muted-foreground">Tracked time: {{ data.timeRecords ? formatTime(data.time) : '0h' }}</div>
        </div>
      </DialogTrigger>
    </div>

    <DialogContent class="max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="mx-auto text-foreground">
          {{ data.name }}
        </DialogTitle>
        <DialogDescription class="flex items-center gap-2">
          <Avatar>
            <AvatarImage v-if="data.projectImage" :src="data.projectImage" alt="@radix-vue" />
            <AvatarFallback class="uppercase">
              {{ data.name.slice(0, 2) }}
            </AvatarFallback>
          </Avatar>
          <span class="text-md text-foreground">
            {{ data.projectName }}
          </span>
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 overflow-y-auto pb-4">
        <div class="flex flex-col items-start text-foreground">
          <span class="text-md text-muted-foreground">Tracked time:</span>
          <span class="text-md font-semibold">{{ data.timeRecords ? formatTime(data.time) : '0h' }}</span>
        </div>
        <div @mouseover="showTimeRecords = true" @mouseleave="showTimeRecords = false" class="group flex cursor-pointer flex-col items-start text-foreground">
          <span class="text-md flex w-full text-muted-foreground">
            <span class="text-md text-muted-foreground duration-200 group-hover:text-foreground">All time records:</span>
            <span class="ml-auto cursor-pointer font-semibold text-primary" @click="showAddTime = true">Add time</span>
          </span>
          <ul v-if="data.timeRecords" class="w-full">
            <li v-for="(record, index) in data.timeRecords.slice(0, 2)" :key="index" class="mt-1 w-full rounded-[2px] bg-border p-1 text-sm">
              +{{ formatTime(record.timeAdded) }} on {{ formatDate(record.dateAdded) }}
              <span @mouseover="recordHoveredIndex = index + 1" @mouseleave="recordHoveredIndex = null">
                - {{ record.addedBy.name + ' ' + record.addedBy.surname }}
                <Transition>
                  <span v-if="recordHoveredIndex === index + 1" class="text-[0.6rem] text-muted-foreground">
                    {{ record.addedBy.email }}
                  </span>
                </Transition>
              </span>
            </li>
            <li v-if="showTimeRecords" v-for="(record, index) in data.timeRecords.slice(2)" :key="index" class="mt-1 w-full rounded-[2px] bg-border p-1 text-sm">
              +{{ formatTime(record.timeAdded) }} on {{ formatDate(record.dateAdded) }}
              <span @mouseover="recordHoveredIndex = index + 1" @mouseleave="recordHoveredIndex = null">
                - {{ record.addedBy.name + ' ' + record.addedBy.surname }}
                <Transition>
                  <span v-if="recordHoveredIndex === index + 1" class="text-[0.6rem] text-muted-foreground">
                    {{ record.addedBy.email }}
                  </span>
                </Transition>
              </span>
            </li>
          </ul>
        </div>
        <div @mouseover="showMembers = true" @mouseleave="showMembers = false" class="group line-clamp-1 flex cursor-pointer flex-col items-start text-foreground">
          <span class="text-md text-muted-foreground duration-200 group-hover:text-foreground">Members ({{ data.members.length }}):</span>
          <span v-for="(member, index) in data.members.slice(0, 2)" @mouseover="hoveredIndex = index + 1" @mouseleave="hoveredIndex = null" class="text-md font-semibold">
            {{ index + 1 + '. ' + member.name + ' ' + member.surname }}
            <Transition>
              <Transition>
                <span v-if="hoveredIndex === index + 1" class="text-xs text-muted-foreground">
                  {{ member.email }}
                </span>
              </Transition>
            </Transition>
          </span>
          <span v-if="showMembers" v-for="(member, index) in data.members.slice(2)" class="text-md font-semibold">{{ index + 1 + '. ' + member.name + ' ' + member.surname }}</span>
        </div>
      </div>
      <Transition :duration="550" name="nested">
        <div v-if="showAddTime" class="outer hole-shadow rounded">
          <div class="inner flex flex-col gap-2 rounded p-4 text-foreground">
            <label class="flex w-full flex-row items-center text-lg">
              <span>Add hours and minutes:</span>
              <span class="ml-auto">
                <X @click="(showAddTime = false), (newTime.hours = 0), (newTime.minutes = 0)" class="size-4 cursor-pointer" />
              </span>
            </label>
            <div class="flex items-end gap-2">
              <NumberField id="hours" v-model.number="newTime.hours" :min="0">
                <Label for="hours">Hours</Label>
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>

              <NumberField id="minutes" v-model.number="newTime.minutes" :min="0" :max="59">
                <Label for="minutes">Minutes</Label>
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>

              <Button class="bg-emerald-500 hover:bg-emerald-600" :disabled="newTime.hours == 0 && newTime.minutes == 0" @click="addTime">
                <Check class="size-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </Transition>
      <DialogFooter>
        <Button :disabled="showAddTime" class="mt-2 w-full border-primary font-normal text-primary hover:text-primary sm:m-0" variant="outline">Complete task</Button>
        <Button :disabled="showAddTime" class="w-full font-normal text-foreground text-white">Start tracking</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'vue-sonner'

export default {
  props: ['data'],
  data() {
    return {
      showAddTime: false,
      showTimeRecords: false,
      showMembers: false,
      newTime: {
        hours: 0,
        minutes: 0,
      },
      hoveredIndex: null,
      recordHoveredIndex: null,
    }
  },
  methods: {
    formatTime(totalMinutes) {
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return `${hours}h ${minutes}m`
    },
    formatDate(dateString) {
      const date = new Date(dateString)

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()

      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${day}.${month}.${year}, ${hours}:${minutes}`
    },
    async addTime() {
      const creatorEmail = JSON.parse(localStorage.getItem('user')).email
      const creatorName = JSON.parse(localStorage.getItem('user')).name
      const creatorSurname = JSON.parse(localStorage.getItem('user')).surname
      const creatorUid = JSON.parse(localStorage.getItem('user')).uid

      try {
        const { hours, minutes } = this.newTime
        const timeAdded = hours * 60 + minutes

        if (timeAdded <= 0) {
          console.warn('Invalid time. No changes made.')
          return
        }

        const projectDocRef = doc(db, 'projects', this.data.projectId)

        const projectDocSnap = await getDoc(projectDocRef)

        if (!projectDocSnap.exists()) {
          throw new Error('Project not found.')
        }

        const projectData = projectDocSnap.data()
        const tasks = projectData.tasks || []

        const updatedTasks = tasks.map((task) => {
          if (task.id === this.data.id) {
            return {
              ...task,
              time: (task.time || 0) + timeAdded,
              timeRecords: [
                ...(task.timeRecords || []),
                {
                  hours,
                  minutes,
                  timeAdded,
                  dateAdded: new Date().toISOString(),
                  addedBy: {
                    uid: creatorUid,
                    email: creatorEmail,
                    name: creatorName,
                    surname: creatorSurname,
                  },
                },
              ],
            }
          }
          return task
        })

        await updateDoc(projectDocRef, { tasks: updatedTasks })

        const updatedTask = updatedTasks.find((task) => task.id === this.data.id)
        if (updatedTask) {
          this.data.time = updatedTask.time
          this.data.timeRecords = updatedTask.timeRecords
        }

        this.newTime.hours = 0
        this.newTime.minutes = 0
        this.showAddTime = false

        toast.success('Time successfully added.')
      } catch (error) {
        console.error('Error adding time:', error)
        toast.error('Failed to add time. Please try again.')
      }
    },
  },
}
</script>

<script setup>
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field'
import { Label } from 'radix-vue'
import { Check, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
</script>

<style scoped>
.hole-shadow {
  -webkit-box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.7);
  -moz-box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.7);
  box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.7);
}
.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}
.nested-leave-active {
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}
.nested-enter-active .inner {
  transition-delay: 0.25s;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);

  opacity: 0.001;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
