<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import GeneralHeader from '@/components/GeneralHeader.vue'
import PerformanceDashboard from '@/components/test-result/PerformanceDashboard.vue'
import GridResult from '@/components/test-result/GridResult.vue'
import DeleteConfirmationDialog from '@/components/ui/dialog/DeleteConfirmationDialog.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Mode } from '@/types/test.types'
import { testHistoryApi } from '@/services/testHistoryApi'
import type { StoredTestResult } from '@/infrastructure/database/TestResultRepository'
import { useDateFormat } from '@vueuse/core'
import { ArrowLeft, Trash2, Calendar, ChevronDown, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const testResult = ref<StoredTestResult | null>(null)
const isLoading = ref(true)
const showDetailedResults = ref(false)
const deleteDialogOpen = ref(false)
const deleteError = ref<string | null>(null)

const mode = computed(() => testResult.value?.mode ?? Mode.PRACTICE)
const modeLabel = computed(() => mode.value === Mode.RANKED ? 'Ranked' : 'Practice')

const formattedDate = computed(() => {
  if (!testResult.value) return ''
  const date = testResult.value.endTime || testResult.value.savedAt
  return useDateFormat(date, 'DD MMMM YYYY, HH:mm', { locales: 'en-US' }).value
})

const loadTestResult = async () => {
  const id = route.params.id as string
  if (!id) {
    router.push('/history')
    return
  }

  try {
    isLoading.value = true
    const result = await testHistoryApi.getById(id)

    if (!result) {
      router.push('/history')
      return
    }

    testResult.value = result
  } catch {
    router.push('/history')
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = () => {
  deleteDialogOpen.value = true
}

const handleDelete = async () => {
  if (!testResult.value) return

  try {
    deleteError.value = null
    await testHistoryApi.delete(testResult.value.id)
    router.push('/history')
  } catch {
    deleteError.value = 'Failed to delete test result. Please try again.'
    deleteDialogOpen.value = false
  }
}

const cancelDelete = () => {
  deleteDialogOpen.value = false
}

const handleBack = () => {
  router.push('/history')
}

onMounted(() => {
  loadTestResult()
})
</script>

<template>
  <div class="relative flex flex-col min-h-screen">
    <GeneralHeader />

    <main class="flex-1 py-6 px-4 sm:px-6 md:px-12 lg:px-20 mt-14 md:mt-20">
      <div class="max-w-6xl mx-auto">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6">
          <Skeleton class="h-8 w-32" />
          <Skeleton class="h-12 w-64" />
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton v-for="i in 4" :key="i" class="h-28 rounded-xl" />
          </div>
          <Skeleton class="h-64 rounded-xl" />
        </div>

        <!-- Content -->
        <div v-else-if="testResult" class="space-y-6">
          <!-- Error Message -->
          <div v-if="deleteError" class="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle :size="18" class="text-destructive shrink-0 mt-0.5" />
            <p class="text-sm text-destructive">{{ deleteError }}</p>
          </div>

          <!-- Back Button -->
          <Button
            variant="ghost"
            size="sm"
            @click="handleBack"
            class="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft :size="16" />
            Back to History
          </Button>

          <!-- Header -->
          <header class="space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Test Results</h1>
              <Badge
                variant="outline"
                class="w-fit"
                :data-mode="mode"
              >
                {{ modeLabel }}
              </Badge>
            </div>

            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar :size="16" />
              <span>{{ formattedDate }}</span>
            </div>
          </header>

          <!-- Performance Dashboard -->
          <PerformanceDashboard :results="testResult" />

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
                    v-for="gridResult in testResult.grids"
                    :key="gridResult.gridIndex"
                    :gridResult="gridResult"
                  />
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-between pt-4 pb-8 border-t border-border/40">
            <Button
              variant="outline"
              @click="confirmDelete"
              class="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <Trash2 :size="16" />
              Delete Result
            </Button>
            <Button variant="outline" @click="handleBack" class="gap-2">
              <ArrowLeft :size="16" />
              Back to History
            </Button>
          </div>
        </div>
      </div>
    </main>

    <!-- Delete Confirmation Dialog -->
    <DeleteConfirmationDialog
      :open="deleteDialogOpen"
      title="Delete Test Result"
      description="Are you sure you want to delete this test result? This action cannot be undone and you will be redirected to the history page."
      confirm-label="Delete"
      @update:open="deleteDialogOpen = $event"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
