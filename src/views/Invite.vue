<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
    <div class="w-full max-w-md rounded-lg border border-border bg-background p-8 shadow-xl">
      <h2 class="mb-6 text-center text-2xl font-semibold text-foreground">Processing your invitation...</h2>

      <p v-if="response === 'accepted'" class="text-center text-lg font-medium text-primary">Thank you for joining the project!</p>
      <p v-else-if="response === 'declined'" class="text-center text-lg font-medium text-red-500">You have declined the invitation.</p>
      <p v-else-if="error" class="text-center text-lg font-medium text-red-500">There was an error processing your response. Please try again.</p>

      <div v-if="!error" class="mt-6 text-center text-muted-foreground">
        <p class="text-xs">You can close this page now or return to your project dashboard.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'vue-sonner'

export default {
  data() {
    return {
      projectId: null,
      email: null,
      response: null,
      error: false,
    }
  },
  async created() {
    const urlParams = new URLSearchParams(window.location.search)
    this.projectId = this.$route.params.projectId
    this.email = urlParams.get('email')
    this.response = urlParams.get('response') || 'accepted'

    try {
      if (!this.email || !this.projectId) {
        this.error = true
        return
      }

      const projectDoc = doc(db, 'projects', this.projectId)
      const projectSnapshot = await getDoc(projectDoc)

      if (projectSnapshot.exists()) {
        const projectData = projectSnapshot.data()

        const updatedMembers = projectData.members.map((member) => {
          if (member.email === this.email) {
            return { ...member, state: this.response }
          }
          return member
        })

        const memberFound = projectData.members.some((member) => member.email === this.email)

        if (!memberFound) {
          toast.error('Invitation not found for this email.')
          this.error = true
          return
        }

        await updateDoc(projectDoc, { members: updatedMembers })

        toast.success(this.response === 'accepted' ? 'You have successfully joined the project!' : 'You have declined the invitation.')
      } else {
        toast.error('Project not found.')
        this.error = true
      }
    } catch (err) {
      console.error('Error processing invitation:', err)
      this.error = true
    }
  },
}
</script>
