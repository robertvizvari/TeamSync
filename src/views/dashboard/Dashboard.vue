<template>
  <div class="overflow-x-hidden bg-background">
    <Sidebar :sidebarActive="sidebarActive" :urlId="urlId" @toggle-sidebar="toggleSidebar" />

    <Navbar @toggle-sidebar="toggleSidebar" />

    <MyTasks v-if="urlId === 'mytasks'" :projects="projects" :tasks="tasks" :loading="loading" @project-created="refetch" />
    <MyProjects v-if="urlId === 'myprojects'" :projects="projects" :loading="loading" @project-created="refetch" />
  </div>
</template>

<script>
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { toast } from 'vue-sonner'

export default {
  data() {
    return {
      sidebarActive: false,
      urlId: null,
      projects: [],
      tasks: [],
      loading: true,
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarActive = !this.sidebarActive
    },
    handleUrlChange() {
      this.urlId = this.$route.params.urlId
    },
    async fetchProjectsAndTasks() {
      this.loading = true

      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user || !user.uid) {
          toast.error('User not logged in.')
          return
        }

        const userId = user.uid
        const projectsRef = collection(db, 'projects')
        const querySnapshot = await getDocs(projectsRef)

        const fetchedProjects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((project) => project.createdBy[0].uid === userId || project.members.some((member) => member.uid === userId && member.state === 'accepted'))

        const userTasks = fetchedProjects.flatMap((project) => {
          const tasks = Array.isArray(project.tasks) ? project.tasks : []
          return tasks
            .filter((task) => task.members.some((member) => member.uid === userId))
            .map((task) => ({
              ...task,
              projectId: project.id,
              projectName: project.projectName,
              projectImage: project.projectImage,
            }))
        })

        this.projects = fetchedProjects
        this.tasks = userTasks
      } catch (error) {
        console.error('Error fetching projects and tasks:', error)
        toast.error('Failed to load data. Please try again.')
      } finally {
        this.loading = false
      }
    },
    async refetch() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user || !user.uid) {
          toast.error('User not logged in.')
          return
        }

        const userId = user.uid
        const projectsRef = collection(db, 'projects')
        const querySnapshot = await getDocs(projectsRef)

        const fetchedProjects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((project) => project.createdBy[0].uid === userId || project.members.some((member) => member.uid === userId && member.state === 'accepted'))

        const userTasks = fetchedProjects.flatMap((project) => {
          const tasks = Array.isArray(project.tasks) ? project.tasks : []
          return tasks
            .filter((task) => task.members.some((member) => member.uid === userId))
            .map((task) => ({
              ...task,
              projectId: project.id,
              projectName: project.projectName,
              projectImage: project.projectImage,
            }))
        })

        this.projects = fetchedProjects
        this.tasks = userTasks
      } catch (error) {
        console.error('Error fetching projects and tasks:', error)
        toast.error('Failed to load data. Please try again.')
      }
    },
  },

  async mounted() {
    this.handleUrlChange()

    if (this.$route.params.urlId === '') {
      this.$router.push('/dashboard/mytasks')
    }

    await this.fetchProjectsAndTasks()
  },
  watch: {
    '$route.params.urlId': 'handleUrlChange',
  },
}
</script>

<script setup>
import Sidebar from './components/Navigation/Sidebar.vue'
import Navbar from './components/Navigation/Navbar.vue'

import MyTasks from './components/My_Tasks/My_Tasks.vue'
import MyProjects from './components/My_Projects/My_Projects.vue'
</script>
