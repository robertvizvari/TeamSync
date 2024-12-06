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
          <div class="text-sm text-muted-foreground">Tracked time: {{ formatTime(data.time) }}</div>
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
          <span class="text-md font-semibold">{{ formatTime(data.time) }}</span>
        </div>
        <div class="flex flex-col items-start text-foreground">
          <span class="text-md flex w-full text-muted-foreground">
            <span>All time records:</span>
            <span class="ml-auto cursor-pointer font-semibold text-primary" @click="showAddTime = true">Add time</span>
          </span>
          <ul>
            <li v-for="(record, index) in data.timeRecords" :key="index" class="text-sm">+{{ formatTime(record.timeAdded) }} on {{ record.dateAdded }}</li>
          </ul>
        </div>
        <div @click="showMembers = !showMembers" class="group line-clamp-1 flex cursor-pointer flex-col items-start text-foreground">
          <span class="text-md text-muted-foreground duration-200 group-hover:text-foreground">Members ({{ data.members.length }}):</span>
          <span v-for="(member, index) in data.members.slice(0, 2)" class="text-md font-semibold">{{ index + 1 + '. ' + member.email }}</span>
          <span v-if="showMembers" v-for="(member, index) in data.members.slice(2)" class="text-md font-semibold">{{ index + 1 + '. ' + member.email }}</span>
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
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/firebase'

export default {
  props: ['data'],
  data() {
    return {
      showMembers: false,
      showAddTime: false,
      newTime: {
        hours: 0,
        minutes: 0,
      },
    }
  },
  methods: {
    formatTime(totalMinutes) {
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return `${hours}h ${minutes}m`
    },
    async addTime() {
      const { hours, minutes } = this.newTime

      if (hours <= 0 && minutes <= 0) {
        alert('Please add a valid amount of time.')
        return
      }

      const now = new Date()
      const dateAdded = now.toISOString() // Current date and time in ISO format
      const timeRecord = {
        hours,
        minutes,
        dateAdded,
      }

      if (!this.data.times) {
        this.data.times = []
      }

      this.data.times.push(timeRecord)
      this.data.time += hours * 60 + minutes // Update total time in minutes

      try {
        const projectDoc = doc(db, 'projects', this.data.projectId)
        await updateDoc(projectDoc, {
          [`tasks.${this.data.taskId}.times`]: arrayUnion(timeRecord),
          [`tasks.${this.data.taskId}.totalTime`]: this.data.time,
        })

        console.log('Time record saved successfully')
      } catch (error) {
        console.error('Error saving time record:', error)
      }

      this.newTime = { hours: 0, minutes: 0 }
      this.showAddTime = false
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
  -webkit-box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.82);
  -moz-box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.82);
  box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.82);
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
</style>
