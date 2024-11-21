<template>
  <div class="min-h-dvh p-2 sm:ml-64">
    <div class="mt-20 flex w-full flex-col p-3">
      <Tabs default-value="latest" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="pinned">Pinned</TabsTrigger>
        </TabsList>
        <div class="my-3">
          <Select :disabled="loading" class="relative" default-value="all">
            <SelectTrigger class="relative text-foreground sm:max-w-[200px]">
              <SelectValue class="text-foreground" placeholder="Select a project" />
              <div v-if="loading" class="absolute right-1 z-[1]">
                <RefreshCw class="mr-2 size-4 animate-spin bg-background bg-opacity-100" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {{ projects.length > 0 ? 'Projects' : 'No projects' }}
                </SelectLabel>
                <SelectItem value="all">Show all</SelectItem>
                <div v-if="projects.length > 0">
                  <SelectItem v-for="project in projects" :value="project.id">{{ project.projectName }}</SelectItem>
                </div>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <TabsContent value="latest" class="w-full">
          <div class="flex w-full flex-col gap-3">
            <Task v-for="task in tasks" :data="task" />
          </div>
        </TabsContent>
        <TabsContent value="pinned">
          <div class="flex w-full flex-col gap-3">
            <Task v-for="task in tasks" :data="task" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script>
export default {
  props: ['projects', 'loading'],
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
import Task from '@/views/dashboard/components/Task.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw } from 'lucide-vue-next'
</script>
