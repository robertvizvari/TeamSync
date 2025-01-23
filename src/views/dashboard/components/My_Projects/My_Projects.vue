<template>
  <div class="h-dvh p-4 pb-36 sm:ml-64">
    <div class="mt-20 h-full">
      <div class="mb-2">
        <DialogButton :initialLoading="loading" @project-created="handleProjectCreated" />
      </div>
      <div class="flex h-full flex-row gap-5 overflow-x-auto overflow-y-hidden pb-3">
        <Transition name="fade">
          <div v-if="loading" class="flex h-full w-full gap-2 overflow-clip">
            <div v-for="index in 6" class="h-full w-[350px] shrink-0 animate-pulse rounded-lg bg-border"></div>
          </div>
        </Transition>

        <div v-if="projects.length == 0 && !loading" class="flex h-full w-full flex-col items-center justify-center">
          <span class="text-2xl font-semibold text-foreground">{{ $t('my_projects.tasks.noProjects') }}</span>
        </div>

        <Card v-if="projects.length > 0 && !loading" v-for="data in projects" :key="data.id" class="mb-5 flex h-full w-[350px] shrink-0 flex-col border-border">
          <CardHeader>
            <CardTitle class="flex items-center gap-4">
              <Avatar>
                <AvatarImage :src="data.projectImage" :alt="data.projectName + ' image'" />
                <AvatarFallback class="uppercase">
                  {{ data.projectName.slice(0, 2) }}
                </AvatarFallback>
              </Avatar>
              <span>{{ data.projectName }}</span>
              <span v-if="userId == data.createdBy[0].uid && userId !== ''" class="ml-auto">
                <DialogTaskSettingsButton :data="data" @project-created="handleProjectCreated" />
              </span>
            </CardTitle>
            <span @click="toggleDescription(data)" :class="data.showDescription ? '' : 'line-clamp-1'" class="cursor-pointer text-sm font-normal text-muted-foreground transition-all duration-200 hover:text-foreground" style="overflow-wrap: anywhere">
              {{ data.description }}
            </span>
          </CardHeader>
          <CardContent class="hidden_scrollbar flex w-full flex-col gap-2 overflow-y-auto">
            <div>
              <div v-if="acceptedMembersCount(data.members) < 1" :class="data.description == '' ? 'py-4' : 'mt-[-4px] pb-4'" class="border-b border-border font-semibold">{{ $t('my_projects.tasks.noOtherMembers') }}</div>

              <Accordion v-if="acceptedMembersCount(data.members) >= 1" type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger :class="data.description !== '' ? 'mt-[-4px] pt-0' : ''">
                    <span>{{ $t('my_projects.tasks.members') }} ({{ data.members.filter((member) => member.state === 'accepted').length + 1 }})</span>
                  </AccordionTrigger>
                  <AccordionContent class="text-[1rem]">
                    <ul v-if="acceptedMembersCount(data.members) > 0">
                      <li class="mt-1 flex flex-row gap-0">
                        <div>
                          <span class="mr-1 cursor-pointer" @mouseover="hoveredIndex = 0" @mouseleave="hoveredIndex = null">1. {{ data.createdBy[0].name + ' ' + data.createdBy[0].surname }}</span>
                          <Transition>
                            <span v-if="hoveredIndex === 0" class="text-xs text-muted-foreground">
                              {{ data.createdBy[0].email }}
                            </span>
                          </Transition>
                        </div>
                      </li>

                      <li v-for="(member, index) in data.members" :key="index">
                        <span v-if="member.state === 'accepted'" class="mr-1 cursor-pointer" @mouseover="hoveredIndex = index + 1" @mouseleave="hoveredIndex = null">
                          {{ index + 2 + '. ' + member.name + ' ' + member.surname }}
                        </span>
                        <Transition>
                          <span v-if="hoveredIndex === index + 1 && member.state === 'accepted'" class="text-xs text-muted-foreground">
                            {{ member.email }}
                          </span>
                        </Transition>
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
                    <AccordionTrigger>{{ $t('my_projects.tasks.tasks') }} ({{ data.tasks.length }})</AccordionTrigger>
                    <AccordionContent class="text-[1rem]">
                      <ul>
                        <li class="relative flex flex-col overflow-hidden rounded-md bg-secondary p-3" v-for="(task, index) in sortedTasksByChecked(data.tasks)" :key="index" :class="index != 0 ? 'mt-2' : ''">
                          <span class="flex flex-row items-start gap-3 font-semibold">
                            <span class="text-wrap">{{ task.name }} - {{ task.time ? formatTime(task.time) : '0h' }}</span>
                            <span v-if="task.state == 'todo'" class="ml-auto select-none whitespace-nowrap rounded-full bg-blue-500 bg-opacity-15 px-[0.6rem] text-[0.6rem] text-blue-500">{{ $t('my_projects.taskStates.todo') }}</span>
                            <span v-else-if="task.state == 'inProgress'" class="ml-auto select-none whitespace-nowrap rounded-full bg-amber-500 bg-opacity-15 px-[0.6rem] text-[0.6rem] text-amber-500">{{ $t('my_projects.taskStates.inProgress') }}</span>
                            <span v-else-if="task.state == 'finished'" class="ml-auto select-none whitespace-nowrap rounded-full bg-emerald-500 bg-opacity-15 px-[0.6rem] text-[0.6rem] text-emerald-500">{{ $t('my_projects.taskStates.finished') }}</span>
                            <span v-else-if="task.state == 'cancelled'" class="ml-auto select-none whitespace-nowrap rounded-full bg-red-500 bg-opacity-15 px-[0.6rem] text-[0.6rem] text-red-500">{{ $t('my_projects.taskStates.cancelled') }}</span>
                          </span>

                          <span class="text-sm text-muted-foreground">{{ task.members.length }} {{ task.members.length > 1 ? $t('my_projects.tasks.members_lowercase') : $t('my_projects.tasks.member_lowercase') }}</span>

                          <TooltipProvider>
                            <Tooltip class="border-border">
                              <TooltipTrigger as-child>
                                <div v-if="task.priority == 'high'" class="absolute bottom-0 right-0 h-[0.2rem] w-full cursor-help bg-red-500"></div>
                                <div v-else-if="task.priority == 'medium'" class="absolute bottom-0 right-0 h-[0.2rem] w-full cursor-help bg-amber-500"></div>
                                <div v-else-if="task.priority == 'low'" class="absolute bottom-0 right-0 h-[0.2rem] w-full cursor-help bg-emerald-500"></div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p v-if="task.priority == 'high'">
                                  {{ $t('my_projects.priorities.firstHalf') }}
                                  <span class="text-red-500">{{ $t('my_projects.priorities.hSign') }}</span>
                                  {{ $t('my_projects.priorities.secondHalf') }}
                                </p>
                                <p v-else-if="task.priority == 'medium'">
                                  {{ $t('my_projects.priorities.firstHalf') }}
                                  <span class="text-amber-500">{{ $t('my_projects.priorities.mSign') }}</span>
                                  {{ $t('my_projects.priorities.secondHalf') }}
                                </p>
                                <p v-else-if="task.priority == 'low'">
                                  {{ $t('my_projects.priorities.firstHalf') }}
                                  <span class="text-emerald-500">{{ $t('my_projects.priorities.lSign') }}</span>
                                  {{ $t('my_projects.priorities.secondHalf') }}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div v-if="!data.tasks" class="border-b border-border py-4">
                <span class="font-semibold">{{ $t('my_projects.tasks.noTasks') }}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter class="mt-auto flex justify-between gap-2 px-6 pb-6 pt-3">
            <DialogTaskButton :data="data" @project-created="handleProjectCreated" />
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['projects', 'loading'],
  data() {
    return {
      hoveredIndex: null,
      showSettings: false,
      userId: '',
    }
  },
  methods: {
    formatTime(totalMinutes) {
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return `${hours}h ${minutes}m`
    },
    toggleDescription(project) {
      project.showDescription = !project.showDescription
    },
    handleProjectCreated(projectId) {
      this.$emit('project-created', projectId)
    },
    sortedTasksByChecked(tasks) {
      return tasks.slice().sort((a, b) => a.checked - b.checked)
    },
    acceptedMembersCount(members) {
      return members.filter((member) => member.state === 'accepted').length
    },
  },

  mounted() {
    this.userId = JSON.parse(localStorage.getItem('user')).uid
  },
}
</script>

<script setup>
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import DialogButton from './components/Dialog_Button.vue'
import DialogTaskButton from './components/Dialog_Task_Button.vue'
import DialogTaskSettingsButton from './components/Dialog_Project_Settings_Button.vue'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hidden_scrollbar::-webkit-scrollbar {
  display: none;
}

.hidden_scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
