<script setup lang="ts">
import TestHeader from '@/components/TestHeader.vue'
import GridNumberInput from '@/components/GridNumberInput.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTimer, useTestConfig } from '@/composables/test'
import { useTestStore } from '@/stores/test'

const router = useRouter()
const gridRef = ref<InstanceType<typeof GridNumberInput> | null>(null)
const testStore = useTestStore()
const testConfig = useTestConfig()
const timer = useTimer()

const handleTestCompleted = () => {
  timer.stop()
  router.push('/test/result')
}

const handleTimerComplete = () => {
  testStore.completeTest()
  router.push('/test/result')
}

onMounted(() => {
  const durationMs = testConfig.getTestDurationMs()
  testStore.startTest(durationMs, testConfig.selectedMode.value)
  timer.start(durationMs, handleTimerComplete)
})
</script>

<template>
  <div class="relative flex flex-col h-screen">
    <TestHeader
      class="relative flex-shrink-0"
      :remainingTime="timer.formattedTime.value"
      :mode="testConfig.selectedMode.value"
    />

    <div class="flex-1 flex items-center justify-center overflow-hidden">
      <GridNumberInput ref="gridRef" @test-completed="handleTestCompleted" />
    </div>
  </div>
</template>
