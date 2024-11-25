<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="w-full border-primary text-primary hover:text-primary" size="sm" variant="outline">Add task</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="text-foreground">Add task</DialogTitle>
        <!-- <DialogDescription>Work with your team to plan, create, and achieve your goals together.</DialogDescription> -->
      </DialogHeader>
      <div class="grid gap-5 py-4">
        <div class="flex w-full flex-col gap-2">
          <Label for="name" class="text-foreground">Name</Label>
          <Input v-model="name" :disabled="loading" id="name" class="text-foreground" placeholder="Important Project" maxlength="50" />
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="description" class="flex gap-1 text-foreground">
            Description
            <p class="mt-[-1px] text-xs text-muted-foreground">(optional)</p>
          </Label>
          <Textarea v-model="description" :disabled="loading" id="description" class="h-40 resize-none text-foreground" placeholder="This project is very important..." maxlength="500" />
        </div>
        <div class="flex w-full flex-col gap-2">
          <Label for="invite" class="flex items-center gap-2 text-foreground">
            Invite your teammates
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <CircleHelp class="size-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent class="border-border">
                  <p class="text-center">
                    After entering the correct email address, press
                    <kbd class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100">Enter</kbd>
                    to add another one.
                    <br />
                    Please do not enter multiple addresses in a single field.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <ComboboxRoot v-model="values" v-model:search-term="searchTerm" multiple class="relative mx-auto my-4 w-full">
            <ComboboxAnchor class="inline-flex w-full items-center justify-between gap-[5px] rounded-lg border border-border bg-background p-2 text-[13px] leading-none text-foreground outline-none">
              <TagsInputRoot v-slot="{ modelValue: tags }" :model-value="values" delimiter="" class="flex flex-wrap items-center gap-2 rounded-lg">
                <TagsInputItem v-for="item in tags" :key="item" :value="item" class="aria-[current=true]:bg-grass9 flex items-center justify-center gap-2 rounded bg-secondary px-2 py-1 text-foreground">
                  <TagsInputItemText class="text-sm" />
                  <TagsInputItemDelete>
                    <Icon icon="lucide:x" />
                  </TagsInputItemDelete>
                </TagsInputItem>

                <ComboboxInput as-child>
                  <TagsInputInput placeholder="Fruits..." class="placeholder:text-mauve10 flex-1 rounded !bg-transparent px-1 focus:outline-none" @keydown.enter.prevent />
                </ComboboxInput>
              </TagsInputRoot>

              <ComboboxTrigger>
                <Icon icon="radix-icons:chevron-down" class="text-grass11 h-4 w-4" />
              </ComboboxTrigger>
            </ComboboxAnchor>
            <ComboboxContent class="absolute z-10 mt-2 w-full overflow-hidden rounded border border-border bg-background shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]">
              <ComboboxViewport class="p-[5px]">
                <ComboboxEmpty class="py-2 text-center text-xs font-medium text-gray-400" />

                <ComboboxGroup>
                  <ComboboxLabel class="px-[25px] text-xs leading-[25px] text-muted-foreground">Fruits</ComboboxLabel>

                  <ComboboxItem v-for="(option, index) in options" :key="index" class="data-[highlighted]:bg-grass8 relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-foreground data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[highlighted]:text-foreground data-[highlighted]:outline-none" :value="option">
                    <ComboboxItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
                      <Icon icon="radix-icons:check" />
                    </ComboboxItemIndicator>
                    <span>
                      {{ option }}
                    </span>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxViewport>
            </ComboboxContent>
          </ComboboxRoot>
        </div>
      </div>
      <DialogFooter>
        <Button v-if="!loading" class="w-full text-white" :disabled="image == '' || name == ''" @click="createProject">Create project</Button>
        <Button v-if="loading" disabled class="w-full text-white">
          Create project
          <RefreshCw class="mr-2 h-4 animate-spin" />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      id: '',
      name: '',
      description: '',
      createdBy: '',
      members: [],
      projectId: '',
      state: '',
      priority: '',
      dueDate: '',
      createdAt: '',
    }
  },
}
</script>

<script setup>
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CircleHelp, RefreshCw } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ref, watch } from 'vue'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxLabel, ComboboxRoot, ComboboxTrigger, ComboboxViewport, TagsInputRoot } from 'radix-vue'
import { Icon } from '@iconify/vue'

const searchTerm = ref('')
const values = ref(['Apple'])
const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']

watch(
  values,
  () => {
    searchTerm.value = ''
  },
  { deep: true }
)
</script>
