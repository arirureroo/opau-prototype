<script setup lang="ts">
import GeneralHeader from '@/components/GeneralHeader.vue'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const showWarning = ref(false)
const dontShowAgain = ref(false)

onMounted(() => {
  const dismissed = localStorage.getItem('opau-prototype-warning-dismissed')
  if (!dismissed) {
    showWarning.value = true
  }
})

const handleDismiss = () => {
  if (dontShowAgain.value) {
    localStorage.setItem('opau-prototype-warning-dismissed', 'true')
  }
  showWarning.value = false
}
</script>

<template>
  <div class="relative flex flex-col min-h-screen">
    <GeneralHeader />

    <div
      class="flex-1 flex flex-col justify-center items-center py-5 px-8 md:px-40"
    >
      <div class="text-center space-y-4 py-12">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">oPau</h1>
        <p class="leading-7 text-xl text-muted-foreground">
          An open source platform for Pauli tests.
        </p>
      </div>

      <Button as-child class="rounded-full">
        <RouterLink to="/pretest">Take a test</RouterLink>
      </Button>
    </div>

    <footer class="py-6 text-center text-sm text-muted-foreground">
      <div class="flex items-center justify-center gap-2">
        <p>
          Created by
          <a
            href="https://github.com/arirureroo"
            target="_blank"
            class="font-medium underline underline-offset-4 hover:text-primary"
          >
            ri.
          </a>
        </p>
        <a
          href="https://github.com/arirureroo/opau-prototype"
          target="_blank"
          class="flex items-center gap-2 hover:text-primary transition-colors"
          aria-label="Source Code"
        >
          <Icon icon="radix-icons:github-logo" class="h-4 w-4" />
        </a>
      </div>
    </footer>

    <Dialog v-model:open="showWarning">
      <DialogContent class="sm:max-w-96 p-8 gap-8 border-none shadow-2xl">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2 text-amber-600 dark:text-amber-500">
            <Icon icon="lucide:flask-conical" class="h-5 w-5" />
            <span class="text-xs font-bold uppercase tracking-widest">Prototype</span>
          </div>

          <div class="space-y-2">
            <DialogTitle class="text-2xl font-bold tracking-tight">
              Welcome to oPau
            </DialogTitle>
            <DialogDescription class="text-base text-muted-foreground leading-relaxed">
              This app is in active development. Features may be unstable and all data is stored locally on your device.
            </DialogDescription>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <Button @click="handleDismiss" class="w-full h-11 rounded-full font-medium text-base" size="lg">
            I understand
          </Button>

          <div class="flex items-center justify-center gap-2.5 group cursor-pointer" @click="dontShowAgain = !dontShowAgain">
            <div class="relative flex items-center">
              <input
                type="checkbox"
                id="dont-show"
                v-model="dontShowAgain"
                class="peer h-4 w-4 shrink-0 rounded-sm border-2 border-muted-foreground/30 text-primary focus:ring-offset-0 focus:ring-0 checked:border-primary checked:bg-primary transition-all cursor-pointer"
              />
            </div>
            <Label
              class="text-sm text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer select-none"
            >
              Don't show this again
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
