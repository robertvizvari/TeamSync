<template>
  <div class="min-h-dvh p-4 sm:ml-64">
    <div :class="cards.length > 3 ? 'overflow-x-scroll' : ''" class="custom-scrollbar mt-20 flex h-full flex-row gap-5">
      <Card v-for="card in cards" class="border-border mb-5 h-full w-[350px] shrink-0">
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
        </CardContent>
        <CardFooter class="flex justify-between px-6 pb-6">
          <Button class="border-primary text-primary hover:text-primary w-full" size="sm" variant="outline">Open</Button>
        </CardFooter>
      </Card>
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
</script>
