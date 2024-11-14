<template>
  <div class="h-dvh p-4 pb-36 sm:ml-64">
    <div class="mt-20 h-full">
      <div class="mb-2">
        <DialogButton />
      </div>
      <div class="flex h-full flex-row gap-5 overflow-x-auto overflow-y-hidden pb-3">
        <Card v-for="card in cards" class="mb-5 flex h-full w-[350px] shrink-0 flex-col border-border">
          <CardHeader>
            <CardTitle class="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
                <AvatarFallback class="uppercase">
                  {{ card.name.slice(0, 2) }}
                </AvatarFallback>
              </Avatar>
              {{ card.name }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="card.tasks">
              <Accordion v-if="card.tasks.length > 3" type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Tasks - 40h</AccordionTrigger>
                  <AccordionContent class="text-[1rem]">
                    <ul>
                      <li :class="index != 0 ? 'mt-1' : ''" v-for="(task, index) in card.tasks">
                        <span>{{ task }}</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div v-if="!card.tasks">
              <span class="font-semibold">No tasks</span>
            </div>
          </CardContent>
          <CardFooter class="mt-auto flex justify-between px-6 pb-6">
            <Button class="w-full border-primary text-primary hover:text-primary" size="sm" variant="outline">Open</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        { name: 'Name 1', project: 'Project 1', tasks: ['Header - 14h', 'Footer - 0h', 'Style - 12h', 'JS - 1.5h', 'PY - 52h'] },
        { name: 'Name 2', project: 'Project 2' },
        { name: 'Name 3', project: 'Project 3' },
        { name: 'Name 4', project: 'Project 4' },
        { name: 'Name 5', project: 'Project 5' },
        { name: 'Name 6', project: 'Project 6' },
        { name: 'Name 7', project: 'Project 7' },
      ],
    }
  },
}
</script>

<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import DialogButton from '../components/Dialog_Button.vue'
</script>
