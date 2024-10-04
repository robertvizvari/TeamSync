<template>
  <div class="min-h-dvh p-2 sm:ml-64">
    <div class="mt-20 flex w-full flex-col p-3">
      <Tabs default-value="account" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="account">Latest</TabsTrigger>
          <TabsTrigger value="password">Pinned</TabsTrigger>
        </TabsList>
        <TabsContent value="account" class="w-full">
          <div class="flex w-full flex-col gap-3">
            <Task v-for="task in tasks" :data="task" />
          </div>
        </TabsContent>
        <TabsContent value="password">asdad</TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        { name: 'Name', project: 'project', time: '13:20' },
        { name: 'Name 2', project: 'project 2', time: '14:20' },
        { name: 'Name 3', project: 'project 3', time: '15:20' },
      ],
    }
  },
}
</script>

<script setup>
import Task from '@/components/Task.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>
