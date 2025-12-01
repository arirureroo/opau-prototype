<script setup lang="ts">
import GeneralHeader from '@/components/GeneralHeader.vue'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ref, onMounted } from 'vue'

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
  <div class="relative flex flex-col">
    <GeneralHeader />

    <div
      class="py-5 px-8 md:px-40 my-auto mx-auto min-h-screen flex flex-col justify-center items-center"
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

    <Dialog v-model:open="showWarning">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Warning</DialogTitle>
          <DialogDescription>
            <span class="font-bold">oPau is currently in a prototype phase.</span> Features may be incomplete or unstable. Your test data is stored locally in your browser and may be lost if you clear your browser data.
          </DialogDescription>
        </DialogHeader>
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="dont-show"
            v-model="dontShowAgain"
            class="h-4 w-4 rounded border-gray-300"
          />
          <label for="dont-show" class="text-sm text-muted-foreground">
            Don't show me again
          </label>
        </div>
        <DialogFooter>
          <Button @click="handleDismiss">I understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
