<template>
  <Dialog class="custom-scrollbar">
    <div class="flex flex-row items-center gap-5 rounded-lg border border-border p-4 text-foreground">
      <div>
        <Checkbox />
      </div>
      <DialogTrigger as-child>
        <div class="flex w-full cursor-pointer flex-col">
          <div class="text-[1rem] font-semibold">
            {{ data.name }}
          </div>
          <div class="text-sm">Project: {{ data.project }}</div>
          <div class="text-sm text-muted-foreground">Tracked time: {{ data.time }}</div>
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
            <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
            <AvatarFallback class="uppercase">
              {{ data.name.slice(0, 2) }}
            </AvatarFallback>
          </Avatar>
          <span class="text-md text-foreground">
            {{ data.project }}
          </span>
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 overflow-y-auto pb-4">
        <div class="flex flex-col items-start text-foreground">
          <span class="text-md text-muted-foreground">Tracked time:</span>
          <span class="text-md font-semibold">{{ data.time }}</span>
        </div>
      </div>
      <DialogFooter>
        <Button class="mt-2 w-full border-primary font-normal text-primary hover:text-primary sm:m-0" variant="outline">Complete task</Button>
        <Button class="w-full font-normal text-foreground">Start tracking</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
export default {
  props: ['data'],
}
</script>

<script setup>
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
</script>
