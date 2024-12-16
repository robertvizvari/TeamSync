<template>
  <div class="min-h-dvh p-2 sm:ml-64">
    <div class="mt-20 flex w-full flex-col p-3">
      <Tabs default-value="latest" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger :disabled="loading" value="latest">Latest</TabsTrigger>
          <TabsTrigger :disabled="loading" value="pinned">Pinned</TabsTrigger>
        </TabsList>
        <div class="my-3">
          <Select v-model="selectValue" :disabled="loading || tasks.length < 1" class="relative" default-value="all">
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
                <SelectItem value="all" class="cursor-pointer transition-all duration-300 ease-in-out">Show all</SelectItem>
                <div v-if="projects.length > 0">
                  <SelectItem v-for="project in projects" :value="project.id" class="cursor-pointer transition-all duration-300 ease-in-out">{{ project.projectName }}</SelectItem>
                </div>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <TabsContent value="latest" class="w-full">
          <div v-if="loading" class="flex w-full flex-col gap-3">
            <div v-for="index in 6" class="h-24 w-full animate-pulse rounded-lg bg-border"></div>
          </div>

          <div v-if="tasks.length < 1" class="mt-40 w-full text-center text-2xl font-semibold text-foreground">No tasks</div>
          <div v-if="tasks.length >= 1" class="flex w-full flex-col gap-0">
            <div v-for="task in tasks" :key="task.id">
              <div :class="(index !== 0 && selectValue == 'all') || (index !== 0 && selectValue == task.projectId) ? 'mt-3' : ''">
                <Task v-if="selectValue == 'all' || selectValue == task.projectId" :data="task" />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="pinned">
          <div v-if="loading" class="flex w-full flex-col gap-3">
            <div v-for="index in 10" class="h-24 w-full animate-pulse rounded-lg bg-border"></div>
          </div>

          <div v-if="tasks.length < 1" class="mt-40 w-full text-center text-2xl font-semibold text-foreground">No tasks</div>
          <div v-if="tasks.length >= 1" class="flex w-full flex-col gap-3">
            <Task v-for="task in tasks" :data="task" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script>
export default {
  props: ['projects', 'loading', 'tasks'],
  data() {
    return {
      selectValue: 'all',
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

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
