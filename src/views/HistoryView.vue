<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GeneralHeader from '@/components/GeneralHeader.vue'
import TestHistoryCard from '@/components/history/TestHistoryCard.vue'
import HistoryFilters from '@/components/history/HistoryFilters.vue'
import HistoryErrorDisplay from '@/components/history/HistoryErrorDisplay.vue'
import HistoryEmptyState from '@/components/history/HistoryEmptyState.vue'
import DeleteConfirmationDialog from '@/components/ui/dialog/DeleteConfirmationDialog.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useHistoryManagement } from '@/composables/history'
import { EmptyStateType } from '@/types/ui.types'
import { Trash2 } from 'lucide-vue-next'

const router = useRouter()

const {
  testResults,
  isLoading,
  loadError,
  deleteError,
  resetError,
  filteredResults,
  loadTestHistory,
  deleteTest,
  resetAllHistory,
  setModeFilter,
  setSortBy,
  setSortOrder,
} = useHistoryManagement()

const deleteDialogOpen = ref(false)
const resetAllDialogOpen = ref(false)
const testToDelete = ref<string | null>(null)

const handleViewTest = (id: string) => {
  router.push(`/history/${id}`)
}

const confirmDelete = (id: string) => {
  testToDelete.value = id
  deleteDialogOpen.value = true
}

const handleDelete = async () => {
  if (!testToDelete.value) return

  try {
    await deleteTest(testToDelete.value)
  } finally {
    deleteDialogOpen.value = false
    testToDelete.value = null
  }
}

const cancelDelete = () => {
  deleteDialogOpen.value = false
  testToDelete.value = null
}

const confirmResetAll = () => {
  resetAllDialogOpen.value = true
}

const handleResetAll = async () => {
  try {
    await resetAllHistory()
  } finally {
    resetAllDialogOpen.value = false
  }
}

const cancelResetAll = () => {
  resetAllDialogOpen.value = false
}

onMounted(() => {
  loadTestHistory()
})
</script>

<template>
  <div class="relative flex flex-col min-h-screen">
    <GeneralHeader />

    <main class="flex-1 py-6 px-4 sm:px-6 md:px-12 lg:px-20 mt-14 md:mt-20">
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Error Messages -->
        <HistoryErrorDisplay
          :load-error="loadError"
          :delete-error="deleteError"
          :reset-error="resetError"
        />

        <!-- Header -->
        <header class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center">
              <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Test History</h1>
            </div>
            <p class="text-muted-foreground">
              Track your progress and analyze performance over time.
            </p>
          </div>
          <Button
            v-if="!isLoading && testResults.length > 0"
            variant="outline"
            size="sm"
            @click="confirmResetAll"
            class="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
          >
            <Trash2 :size="16" />
            <span class="hidden sm:inline">Clear All</span>
          </Button>
        </header>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6">
          <Skeleton class="h-20 rounded-xl" />
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton v-for="i in 6" :key="i" class="h-64 rounded-xl" />
          </div>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- Filters -->
          <HistoryFilters
            v-if="testResults.length > 0"
            @update:mode-filter="setModeFilter"
            @update:sort-by="setSortBy"
            @update:sort-order="setSortOrder"
          />

          <!-- Results Grid -->
          <div v-if="filteredResults.length > 0" class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-medium text-muted-foreground">
                {{ filteredResults.length }} {{ filteredResults.length === 1 ? 'test' : 'tests' }} found
              </h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TestHistoryCard
                v-for="result in filteredResults"
                :key="result.id"
                :test-result="result"
                @view="handleViewTest"
                @delete="confirmDelete"
              />
            </div>
          </div>

          <!-- Empty States -->
          <HistoryEmptyState
            v-else-if="testResults.length === 0"
            :type="EmptyStateType.NO_TESTS"
          />
          <HistoryEmptyState
            v-else
            :type="EmptyStateType.NO_RESULTS"
          />
        </template>
      </div>
    </main>

    <!-- Delete Confirmation Dialog -->
    <DeleteConfirmationDialog
      :open="deleteDialogOpen"
      title="Delete Test Result"
      description="Are you sure you want to delete this test result? This action cannot be undone."
      confirm-label="Delete"
      @update:open="deleteDialogOpen = $event"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />

    <!-- Reset All Confirmation Dialog -->
    <DeleteConfirmationDialog
      :open="resetAllDialogOpen"
      title="Clear All Test History"
      :description="`Are you sure you want to delete all test history? This will permanently remove all ${testResults.length} test result${testResults.length === 1 ? '' : 's'} from your history. This action cannot be undone.`"
      confirm-label="Clear All History"
      @update:open="resetAllDialogOpen = $event"
      @confirm="handleResetAll"
      @cancel="cancelResetAll"
    />
  </div>
</template>
