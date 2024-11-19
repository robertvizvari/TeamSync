<template>
  <div class="overflow-x-hidden bg-background">
    <Sidebar :sidebarActive="sidebarActive" :urlId="urlId" @toggle-sidebar="toggleSidebar" />

    <Navbar @toggle-sidebar="toggleSidebar" />

    <MyTasks v-if="urlId == 'mytasks'" :projects="projects" :loading="loading" />
    <MyProjects v-if="urlId == 'myprojects'" :projects="projects" :loading="loading" />
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
    async fetchProjects() {
      this.loading = true

      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user || !user.uid) {
          toast.error('User not logged in.')
          return
        }

        const projectsRef = collection(db, 'projects')
        const querySnapshot = await getDocs(projectsRef)

        const userId = user.uid

        const fetchedProjects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((project) => project.createdBy[0].uid === userId || project.members.some((member) => member.uid === userId && member.state === 'accepted'))

        this.loading = false
        this.projects = fetchedProjects
      } catch (error) {
        console.error('Error fetching projects:', error)
        toast.error('Failed to load projects. Please try again.')
        this.loading = false
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
