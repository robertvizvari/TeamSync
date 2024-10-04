<script setup>
import { computed } from 'vue'
import { TabsList } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  loop: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
})

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <TabsList v-bind="delegatedProps" :class="cn('mx-auto inline-flex max-w-[50rem] items-center justify-center rounded-full bg-muted p-1 text-muted-foreground', props.class)">
    <slot />
  </TabsList>
</template>
