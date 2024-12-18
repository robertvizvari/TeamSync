<script setup>
import { ref, computed, watch } from 'vue'
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'radix-vue'
import { Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps({
  defaultChecked: { type: Boolean, required: false },
  checked: { type: [Boolean, String], required: false },
  disabled: { type: Boolean, required: false },
  required: { type: Boolean, required: false },
  name: { type: String, required: false },
  value: { type: String, required: false },
  id: { type: String, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
})
const emits = defineEmits(['update:checked'])

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const checkbox = ref(null)

const isChecked = ref(false)

watch(
  checkbox,
  (el) => {
    if (el && el.$el) {
      const mutationObserver = new MutationObserver(() => {
        const isCheckedAttr = el.$el.getAttribute('data-state')
        isChecked.value = isCheckedAttr === 'checked'
      })
      mutationObserver.observe(el.$el, { attributes: true })
    }
  },
  { immediate: true }
)
</script>

<template>
  <CheckboxRoot ref="checkbox" v-bind="forwarded" :class="cn('peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-white', props.class)">
    <CheckboxIndicator class="flex h-full w-full items-center justify-center transition-transform duration-300">
      <slot>
        <Check class="h-4 w-4" style="opacity: 100%" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
