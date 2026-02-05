<script setup lang="ts">
import { onMounted } from 'vue'
import GeneralHeader from '@/components/GeneralHeader.vue'
import PerformanceOverview from '@/components/performance/PerformanceOverview.vue'
import PerformanceTrends from '@/components/performance/PerformanceTrends.vue'
import BestRecords from '@/components/performance/BestRecords.vue'
import ModeComparison from '@/components/performance/ModeComparison.vue'
import PerformanceInsights from '@/components/performance/PerformanceInsights.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, BarChart3 } from 'lucide-vue-next'
import { usePerformanceStats } from '@/composables/performance'

const { stats, isLoading, loadError, loadPerformanceData } = usePerformanceStats()

onMounted(() => {
  loadPerformanceData()
})
</script>

<template>
  <div class="relative flex flex-col min-h-screen">
    <GeneralHeader />

    <main class="flex-1 py-6 px-4 sm:px-6 md:px-12 lg:px-20 mt-14 md:mt-20">
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Error Message -->
        <div
          v-if="loadError"
          class="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
        >
          <AlertCircle :size="18" class="text-destructive shrink-0 mt-0.5" />
          <p class="text-sm text-destructive">{{ loadError }}</p>
        </div>

        <!-- Header -->
        <header class="space-y-1">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Performance</h1>
          </div>
          <p class="text-muted-foreground">
            Track your progress and analyze performance trends over time.
          </p>
        </header>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton v-for="i in 4" :key="i" class="h-28 rounded-xl" />
          </div>
          <Skeleton class="h-72 rounded-xl" />
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton class="h-64 rounded-xl" />
            <Skeleton class="h-64 rounded-xl" />
          </div>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- Empty State -->
          <div
            v-if="stats.totalTests === 0"
            class="flex flex-col items-center justify-center py-16 text-center"
          >
            <div class="p-4 rounded-full bg-muted/50 mb-4">
              <BarChart3 :size="48" class="text-muted-foreground" />
            </div>
            <h2 class="text-xl font-semibold mb-2">No Performance Data Yet</h2>
            <p class="text-muted-foreground max-w-md">
              Take some tests to see your performance statistics and track your progress over time.
            </p>
            <RouterLink
              to="/pretest"
              class="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Take a Test
            </RouterLink>
          </div>

          <!-- Stats Content -->
          <template v-else>
            <!-- Overview Stats -->
            <PerformanceOverview :stats="stats" />

            <!-- Trends Chart -->
            <PerformanceTrends :trends="stats.trends" />

            <!-- Records -->
            <BestRecords
              :best-accuracy="stats.bestAccuracy"
              :best-a-p-m="stats.bestAPM"
              :worst-accuracy="stats.worstAccuracy"
              :worst-a-p-m="stats.worstAPM"
              :trends="stats.trends"
            />

            <!-- Mode Comparison -->
            <ModeComparison
              :ranked-stats="stats.rankedStats"
              :practice-stats="stats.practiceStats"
            />

            <!-- Performance Insights -->
            <PerformanceInsights :stats="stats" />
          </template>
        </template>
      </div>
    </main>
  </div>
</template>
