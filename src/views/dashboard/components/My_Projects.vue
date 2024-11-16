<template>
  <div class="h-dvh p-4 pb-36 sm:ml-64">
    <div class="mt-20 h-full">
      <div class="mb-2">
        <DialogButton />
      </div>
      <div class="flex h-full flex-row gap-5 overflow-x-auto overflow-y-hidden pb-3">
        <Card v-for="data in projects" :key="data.id" class="mb-5 flex h-full w-[350px] shrink-0 flex-col border-border">
          <CardHeader>
            <CardTitle class="flex items-center gap-4">
              <Avatar>
                <AvatarImage :src="data.projectImage" :alt="data.projectName + ' image'" />
                <AvatarFallback class="uppercase">
                  {{ data.projectName.slice(0, 2) }}
                </AvatarFallback>
              </Avatar>
              <span>{{ data.projectName }}</span>
            </CardTitle>
            <span @click="toggleDescription(data)" :class="data.showDescription ? '' : 'line-clamp-2'" class="cursor-pointer text-sm font-normal text-muted-foreground transition-all duration-200 hover:text-foreground">{{ data.description }}</span>
          </CardHeader>
          <CardContent class="flex w-full flex-col gap-2">
            <div>
              <div v-if="data.members.length == 0" class="font-semibold">No other members</div>

              <Accordion v-if="data.members.length > 0" type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Members ({{ data.members.length }})</AccordionTrigger>
                  <AccordionContent class="text-[1rem]">
                    <ul>
                      <li v-for="(member, index) in data.members" :key="index" :class="index != 0 ? 'mt-1' : ''">
                        <span>{{ index + 1 + '. ' + member.email }}</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <div>
                <Accordion v-if="data.tasks && data.tasks.length > 0" type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Tasks - 40h</AccordionTrigger>
                    <AccordionContent class="text-[1rem]">
                      <ul>
                        <li v-for="(task, index) in data.tasks" :key="index" :class="index != 0 ? 'mt-1' : ''">
                          <span>{{ task }}</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div v-if="!data.tasks">
                <span class="font-semibold">No tasks</span>
              </div>
            </div>
          </CardContent>
          <CardFooter class="mt-auto flex justify-between gap-2 px-6 pb-6">
            <Button class="w-full border-primary text-primary hover:text-primary" size="sm" variant="outline">Add task</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import DialogButton from '../components/Dialog_Button.vue'

const props = defineProps({
  projects: Array,
})

const toggleDescription = (project) => {
  project.showDescription = !project.showDescription
}
</script>
