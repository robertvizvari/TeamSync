<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="w-full border-primary text-primary hover:text-primary" size="sm" variant="outline">Add task</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="text-foreground">Add task</DialogTitle>
        <!-- <DialogDescription>Work with your team to plan, create, and achieve your goals together.</DialogDescription> -->
      </DialogHeader>
      <div class="grid gap-5 py-4">
        <div class="flex w-full flex-col gap-2">
          <Label for="name" class="text-foreground">Name</Label>
          <Input v-model="name" :disabled="loading" id="name" class="text-foreground" placeholder="Important Project" maxlength="50" />
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="description" class="flex gap-1 text-foreground">
            Description
            <p class="mt-[-1px] text-xs text-muted-foreground">(optional)</p>
          </Label>
          <Textarea v-model="description" :disabled="loading" id="description" class="h-32 resize-none text-foreground" placeholder="This project is very important..." maxlength="250" />
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

                  <ComboboxItem class="data-[highlighted]:bg-grass8 relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-foreground data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[highlighted]:text-foreground data-[highlighted]:outline-none" :value="data.createdBy[0].email">
                    <ComboboxItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
                      <Icon icon="radix-icons:check" />
                    </ComboboxItemIndicator>
                    <span>
                      {{ data.createdBy[0].email }}
                    </span>
                  </ComboboxItem>
                  <ComboboxItem v-for="(member, index) in members" :key="index" class="data-[highlighted]:bg-grass8 relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-foreground data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[highlighted]:text-foreground data-[highlighted]:outline-none" :value="member.email">
                    <ComboboxItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
                      <Icon icon="radix-icons:check" />
                    </ComboboxItemIndicator>
                    <span>
                      {{ member.email }}
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
                <Button variant="outline" class="w-[250px] ps-3 text-start font-normal text-foreground">
                  <span>{{ dueDate ? dueDate : 'Pick a date' }}</span>
                  <CalendarIcon v-if="!dueDate" class="ms-auto h-4 w-4 opacity-50" />
                  <X v-if="dueDate" @click="dueDate = ''" class="ms-auto h-4 w-4 opacity-50 transition-all duration-300 hover:text-red-500" />
                </Button>
                <input hidden />
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar v-model:placeholder="placeholder" v-model="dueDate" calendar-label="Date of birth" initial-focus />
              </PopoverContent>
            </Popover>
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label class="flex gap-1 text-foreground">State</Label>
            <div class="relative inline-block h-4">
              <Transition name="slide-up">
                <Button class="absolute bg-amber-500 px-4 text-white hover:bg-amber-600" v-if="state === 'pending'" @click="state = 'accepted'">Pending</Button>
                <Button class="absolute bg-emerald-600 px-4 text-white hover:bg-emerald-700" v-else-if="state === 'accepted'" @click="state = 'cancelled'">Accepted</Button>
                <Button class="absolute px-4 text-white" v-else-if="state === 'cancelled'" @click="state = 'pending'" variant="destructive">Cancelled</Button>
              </Transition>
            </div>
          </div>
          <div class="flex w-full flex-col gap-2">
            <Label class="flex gap-1 text-foreground">Priority</Label>
            <div class="relative inline-block h-4">
              <Transition name="slide-up">
                <Button class="absolute bg-amber-500 px-4 text-white hover:bg-amber-600" v-if="priority === 'medium'" @click="priority = 'low'">Meduim</Button>
                <Button class="absolute bg-emerald-600 px-4 text-white hover:bg-emerald-700" v-else-if="priority === 'low'" @click="priority = 'high'">Low</Button>
                <Button class="absolute px-4 text-white" v-else-if="priority === 'high'" @click="priority = 'medium'" variant="destructive">High</Button>
              </Transition>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button v-if="!loading" class="w-full text-white" :disabled="name == ''">Add task</Button>
        <Button v-if="loading" disabled class="w-full text-white">
          Add task
          <RefreshCw class="mr-2 h-4 animate-spin" />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      id: '',
      name: '',
      description: '',
      createdBy: '',
      members: [],
      assignMembers: [],
      projectId: '',
      state: 'pending',
      priority: 'medium',
      dueDate: '',
      createdAt: '',
      loading: false,
      searchTerm: '',
    }
  },
  mounted() {
    if (this.data.members.length >= 1) {
      this.members = this.data.members
    }
  },
  watch: {
    assignMembers: {
      handler() {
        this.searchTerm = ''
      },
      deep: true,
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
import { CircleHelp, RefreshCw } from 'lucide-vue-next'
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
</style>
