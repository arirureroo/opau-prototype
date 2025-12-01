<script setup lang="ts">
import { FileQuestion, SearchX } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { EmptyStateType } from '@/types/ui.types'

defineProps<{
  type: EmptyStateType
}>()

const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <div class="p-4 rounded-2xl bg-muted/30 mb-4">
      <FileQuestion v-if="type === EmptyStateType.NO_TESTS" :size="40" class="text-muted-foreground/50" />
      <SearchX v-else :size="40" class="text-muted-foreground/50" />
    </div>

    <h3 class="text-lg font-semibold text-center mb-2">
      {{ type === EmptyStateType.NO_TESTS ? 'No test history yet' : 'No results found' }}
    </h3>

    <p class="text-sm text-muted-foreground text-center max-w-sm mb-6">
      {{
        type === EmptyStateType.NO_TESTS
          ? 'Complete your first test to start tracking your progress and performance.'
          : 'Try adjusting your filters to see more results.'
      }}
    </p>

    <Button
      v-if="type === EmptyStateType.NO_TESTS"
      @click="router.push('/pretest')"
    >
      Start Your First Test
    </Button>
  </div>
</template>
