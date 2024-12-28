<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm">
        <Languages class="h-[1.2rem] w-[1.2rem] text-foreground" />
        <span class="sr-only">Language change</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="z-[9999] border-border">
      <DropdownMenuItem :disabled="locale === 'en'" @click="changeLocale('en')">{{ $t('buttons.languages.en') }}</DropdownMenuItem>
      <DropdownMenuItem :disabled="locale === 'de'" @click="changeLocale('de')">{{ $t('buttons.languages.de') }}</DropdownMenuItem>
      <DropdownMenuItem :disabled="locale === 'es'" @click="changeLocale('es')">{{ $t('buttons.languages.es') }}</DropdownMenuItem>
      <DropdownMenuItem :disabled="locale === 'sk'" @click="changeLocale('sk')">{{ $t('buttons.languages.sk') }}</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import Button from './ui/button/Button.vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Languages } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

const changeLocale = (newLocale) => {
  locale.value = newLocale
  currentLocale.value = newLocale
  localStorage.setItem('locale', newLocale)
}
</script>
