<template>
  <div class="overflow-x-hidden bg-background">
    <Sidebar :sidebarActive="sidebarActive" :urlId="urlId" @toggle-sidebar="toggleSidebar" />

    <Navbar @toggle-sidebar="toggleSidebar" />

    <MyTasks v-show="urlId == 'mytasks'" />
    <MyProjects v-show="urlId == 'myprojects'" :projects="projects" />
  </div>
</template>

<script>
import { db } from '@/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { toast } from 'vue-sonner'

export default {
  data() {
    return {
      sidebarActive: false,
      urlId: null,
      projects: [],
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarActive = !this.sidebarActive
    },
    handleUrlChange() {
      this.urlId = this.$route.params.urlId
    },
    async fetchProjects() {
      try {
        const user = JSON.parse(localStorage.getItem('user')) // Get current user from localStorage
        if (!user || !user.uid) {
          toast.error('User not logged in.')
          return
        }

        console.log('Fetching projects for user UID:', user.uid) // Debug log

        const projectsRef = collection(db, 'projects')
        const querySnapshot = await getDocs(projectsRef) // Fetch all projects

        console.log('Total projects fetched:', querySnapshot.size) // Log number of results

        // Filter projects where the user's UID is in members
        const fetchedProjects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((project) => project.members.some((member) => member.uid === user.uid))

        console.log('Projects with user UID:', fetchedProjects) // Log matched projects

        this.projects = fetchedProjects
      } catch (error) {
        console.error('Error fetching projects:', error)
        toast.error('Failed to load projects. Please try again.')
      }
    },
  },

  async mounted() {
    this.handleUrlChange()

    if (this.$route.params.urlId === '') {
      this.$router.push('/dashboard/mytasks')
    }

    await this.fetchProjects()
  },
  watch: {
    '$route.params.urlId': 'handleUrlChange',
  },
}
</script>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

import MyTasks from './components/My_Tasks.vue'
import MyProjects from './components/My_Projects.vue'
</script>
