<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '@/stores/test'
import GeneralHeader from '@/components/GeneralHeader.vue'
import TestAnalysisDashboard from '@/components/test-result/TestAnalysisDashboard.vue'
import GridResult from '@/components/test-result/GridResult.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Mode } from '@/types/test.types'
import { testHistoryApi } from '@/services/testHistoryApi'
import { ChevronDown, Home, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const testStore = useTestStore()
const showDetailedResults = ref(false)
const isSaving = ref(false)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)

const results = testStore.calculateTestResult

const mode = computed(() => results.mode ?? Mode.PRACTICE)
const modeLabel = computed(() => mode.value === Mode.RANKED ? 'Ranked' : 'Practice')

onMounted(async () => {
  if (testStore.grids.length === 0) {
    router.push('/pretest')
    return
  }

  try {
    isSaving.value = true
    saveError.value = null
    const plainResults = JSON.parse(JSON.stringify(results))
    await testHistoryApi.create(plainResults)
    saveSuccess.value = true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    saveError.value = `Failed to save test results: ${errorMessage}. Results will not appear in history.`
  } finally {
    isSaving.value = false
  }
})

onBeforeUnmount(() => {
  testStore.reset()
})

const handleRetakeTest = () => {
  testStore.reset()
  router.push('/pretest')
}

const handleGoHome = () => {
  testStore.reset()
  router.push('/')
}
</script>

<template>
  <div class="relative flex flex-col min-h-screen">
    <GeneralHeader />

    <main class="flex-1 py-6 px-4 sm:px-6 md:px-12 lg:px-20 mt-14 md:mt-20">
      <div class="max-w-6xl mx-auto space-y-8">
        <!-- Header Section -->
        <header class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-3">
                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Test Complete</h1>
                <Badge
                  variant="outline"
                  class="text-xs"
                  :data-mode="mode"
                >
                  {{ modeLabel }}
                </Badge>
              </div>
              <p class="text-muted-foreground">
                Your performance has been analyzed and recorded.
              </p>
            </div>
          </div>

          <!-- Status Messages -->
          <div v-if="saveError" class="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle :size="18" class="text-destructive shrink-0 mt-0.5" />
            <p class="text-sm text-destructive">{{ saveError }}</p>
          </div>

          <div v-else-if="saveSuccess" class="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 :size="18" class="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p class="text-sm text-emerald-700 dark:text-emerald-300">Results saved to your history.</p>
          </div>
        </header>

        <!-- Performance Dashboard -->
        <TestAnalysisDashboard :results="results" />

        <!-- Detailed Grid Results (Collapsible) -->
        <Collapsible v-model:open="showDetailedResults">
          <div class="rounded-xl border border-border/40 bg-card">
            <CollapsibleTrigger as-child>
              <button class="flex items-center justify-between w-full p-5 text-left hover:bg-muted/30 transition-colors rounded-xl">
                <div>
                  <h3 class="text-sm font-medium">Detailed Grid Results</h3>
                  <p class="text-xs text-muted-foreground mt-0.5">View individual answers for each grid</p>
                </div>
                <ChevronDown
                  :size="20"
                  class="text-muted-foreground transition-transform duration-200"
                  :class="showDetailedResults ? 'rotate-180' : ''"
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="px-5 pb-5 space-y-4 border-t border-border/40 pt-4">
                <GridResult
                  v-for="gridResult in results.grids"
                  :key="gridResult.gridIndex"
                  :gridResult="gridResult"
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-end pt-4 pb-8">
          <Button
            variant="outline"
            @click="handleGoHome"
            class="gap-2"
          >
            <Home :size="16" />
            Go Home
          </Button>
          <Button
            @click="handleRetakeTest"
            class="gap-2"
          >
            <RotateCcw :size="16" />
            Take Another Test
          </Button>
        </div>
      </div>
    </main>
  </div>
</template>
