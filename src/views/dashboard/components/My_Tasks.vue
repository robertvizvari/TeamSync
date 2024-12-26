<template>
  <div class="min-h-dvh p-2 sm:ml-64">
    <div class="mt-20 flex w-full flex-col p-3">
      <Tabs default-value="latest" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger :disabled="loading" value="latest">Latest</TabsTrigger>
          <TabsTrigger :disabled="loading" value="pinned">Pinned</TabsTrigger>
        </TabsList>
        <div class="mt-5">
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
          <div v-else>
            <section v-if="filteredTasksUnchecked.length < 1 && filteredTasksChecked.length < 1">
              <div class="flex w-full flex-col items-center justify-center">
                <div class="mt-64 text-xl font-semibold text-foreground">
                  {{ selectValue === 'all' ? 'No tasks' : `No tasks in ${findProjectName(selectValue)}` }}
                </div>
              </div>
            </section>

            <section>
              <div v-for="(task, index) in filteredTasksUnchecked" :key="task.id" :class="index != 0 ? 'mt-3' : ''">
                <Task :data="task" :projects="projects" @project-created="$emit('project-created')" />
              </div>
            </section>

            <section class="mt-3">
              <div v-for="(task, index) in filteredTasksChecked" :key="task.id" :class="index != 0 ? 'mt-3' : ''">
                <Task :data="task" :projects="projects" @project-created="$emit('project-created')" />
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="pinned">
          <div v-if="loading" class="flex w-full flex-col gap-3">
            <div v-for="index in 6" class="h-24 w-full animate-pulse rounded-lg bg-border"></div>
          </div>
          <div v-else>
            <section v-if="filteredTasksPinnedUnchecked.length < 1 && filteredTasksPinnedChecked.length < 1">
              <div class="flex w-full flex-col items-center justify-center">
                <div class="mt-64 text-xl font-semibold text-foreground">
                  {{ selectValue === 'all' ? 'No pinned tasks' : `No pinned tasks in ${findProjectName(selectValue)}` }}
                </div>
              </div>
            </section>

            <section>
              <div v-for="(task, index) in filteredTasksPinnedUnchecked" :key="task.id" :class="index != 0 ? 'mt-3' : ''">
                <Task :data="task" :projects="projects" />
              </div>
            </section>

            <section class="mt-3">
              <div v-for="(task, index) in filteredTasksPinnedChecked" :key="task.id" :class="index != 0 ? 'mt-3' : ''">
                <Task :data="task" :projects="projects" />
              </div>
            </section>
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
  methods: {
    findProjectName(id) {
      return this.projects.find((project) => project.id === id).projectName
    },
  },
  computed: {
    tasksUnchecked() {
      return this.tasks.filter((task) => !task.checked)
    },
    tasksChecked() {
      return this.tasks.filter((task) => task.checked)
    },
    tasksPinnedUnchecked() {
      return this.tasks.filter((task) => !task.checked && task.taskPinned)
    },
    tasksPinnedChecked() {
      return this.tasks.filter((task) => task.checked && task.taskPinned)
    },
    filteredTasksUnchecked() {
      return this.selectValue === 'all' ? this.tasksUnchecked : this.tasksUnchecked.filter((task) => task.projectId === this.selectValue)
    },
    filteredTasksChecked() {
      return this.selectValue === 'all' ? this.tasksChecked : this.tasksChecked.filter((task) => task.projectId === this.selectValue)
    },
    filteredTasksPinnedUnchecked() {
      return this.selectValue === 'all' ? this.tasksPinnedUnchecked : this.tasksPinnedUnchecked.filter((task) => task.projectId === this.selectValue)
    },
    filteredTasksPinnedChecked() {
      return this.selectValue === 'all' ? this.tasksPinnedChecked : this.tasksPinnedChecked.filter((task) => task.projectId === this.selectValue)
    },
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
