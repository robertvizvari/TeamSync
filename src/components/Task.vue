<template>
  <div class="flex flex-row items-center gap-5 rounded-lg border border-border p-4 text-foreground">
    <div>
      <Checkbox />
    </div>
    <div class="flex w-full flex-col">
      <div class="text-[1rem] font-semibold">
        {{ data.name }}
      </div>
      <div class="text-sm">Project: {{ data.project }}</div>
      <div class="text-sm text-muted-foreground">Tracked time: {{ data.time }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
}
</script>

<script setup>
import { Checkbox } from '@/components/ui/checkbox'
</script>
