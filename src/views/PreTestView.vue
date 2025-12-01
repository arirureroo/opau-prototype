<script setup lang="ts">
import GeneralHeader from '@/components/GeneralHeader.vue'
import TestConfirmationDialog from '@/components/TestConfirmationDialog.vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Mode } from '@/types/test.types'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTestConfig } from '@/composables/test'

const { selectedMode, selectedDuration, setMode, setDuration, getTestDurationMinutes } =
  useTestConfig()
const router = useRouter()

const durationArray = computed({
  get: () => [selectedDuration.value],
  set: (value: number[]) => setDuration(value[0])
})

const handleModeChange = (value: string) => {
  setMode(value as Mode)
}

const handleStartTest = () => {
  router.push('/test')
}
</script>
<template>
  <div class="relative flex flex-col">
    <GeneralHeader />

    <div class="py-5 px-8 md:px-40 mt-10 md:mt-20 flex flex-col">
      <div class="space-y-4 py-4">
        <h2 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors">
          Before you start
        </h2>
        <p class="text-muted-foreground">
          Select the following settings before proceeding with the Pauli test.
        </p>
      </div>

      <div class="space-y-4 py-4">
        <div class="flex flex-col gap-2">
          <h3 class="scroll-m-20 uppercase font-semibold tracking-tight">Mode</h3>
          <RadioGroup
            :model-value="selectedMode"
            @update:model-value="handleModeChange"
            :default-value="Mode.RANKED"
            class="flex flex-col sm:flex-row gap-4 sm:gap-8"
          >
            <div class="flex-1">
              <RadioGroupItem :id="Mode.RANKED" :value="Mode.RANKED" class="sr-only" />
              <Label
                :for="Mode.RANKED"
                class="flex flex-col py-2 px-4 items-start h-full hover:bg-muted rounded-lg cursor-pointer border-2 border-secondary"
                :class="
                  selectedMode === Mode.RANKED
                    ? 'border-secondary-foreground'
                    : 'text-muted-foreground'
                "
              >
                <span class="text-lg font-bold">Ranked</span>
                <span class="text-sm text-muted-foreground"
                  >Score will be counted in the leaderboard</span
                >
              </Label>
            </div>
            <div class="flex-1">
              <RadioGroupItem :id="Mode.PRACTICE" :value="Mode.PRACTICE" class="sr-only" />
              <Label
                :for="Mode.PRACTICE"
                class="flex flex-col py-2 px-4 items-start h-full hover:bg-muted rounded-lg cursor-pointer border-2 border-secondary"
                :class="
                  selectedMode === Mode.PRACTICE
                    ? 'border-secondary-foreground'
                    : 'text-muted-foreground'
                "
              >
                <span class="text-lg font-semibold">Practice</span>
                <span class="text-sm text-muted-foreground"
                  >Scores will not count towards the leaderboard</span
                >
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div v-if="selectedMode === Mode.PRACTICE" class="space-y-4 py-4">
        <div class="flex flex-col gap-2">
          <h3 class="scroll-m-20 uppercase font-semibold tracking-tight">Practice Duration</h3>
          <Slider v-model="durationArray" :default-value="[5]" :min="1" :max="60" :step="1" />
          <div class="flex justify-between gap-2 text-sm text-muted-foreground">
            <p class="w-fit">How many minutes is the practice?</p>
            <p class="w-fit">{{ selectedDuration }} min</p>
          </div>
        </div>
      </div>

      <div class="flex pt-4 justify-end">
        <TestConfirmationDialog
          :mode="selectedMode"
          :duration="getTestDurationMinutes"
          @confirm="handleStartTest"
        >
          <template #trigger>
            <Button class="rounded-full w-fit">Take the test</Button>
          </template>
        </TestConfirmationDialog>
      </div>
    </div>
  </div>
</template>
