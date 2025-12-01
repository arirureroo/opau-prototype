<script setup lang="ts">
import TestMetricsOverview from './TestMetricsOverview.vue'
import TimeseriesChart from './TimeseriesChart.vue'
import TiankerMetrics from './TiankerMetrics.vue'
import PankerMetrics from './PankerMetrics.vue'
import ConsistencyMetrics from './ConsistencyMetrics.vue'
import EnduranceMetrics from './EnduranceMetrics.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Target, Zap, Activity, Battery } from 'lucide-vue-next'
import type { TestResult } from '@/types/test.types'

interface Props {
  results: TestResult
}

defineProps<Props>()
</script>

<template>
  <div v-if="results.timeseries && results.timeseries.length > 0" class="space-y-6">
    <TestMetricsOverview :results="results" />

    <div class="rounded-xl border border-border/40 bg-card p-5">
      <h3 class="text-sm font-medium text-muted-foreground mb-4">Performance Timeline</h3>
      <TimeseriesChart :data="results.timeseries" />
    </div>

    <Tabs default-value="accuracy" class="w-full">
      <TabsList class="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-1 p-1">
        <TabsTrigger value="accuracy" class="gap-2 py-2.5 data-[state=active]:shadow-sm">
          <Target :size="16" />
          <span class="hidden sm:inline">Accuracy</span>
          <span class="sm:hidden">Tianker</span>
        </TabsTrigger>
        <TabsTrigger value="speed" class="gap-2 py-2.5 data-[state=active]:shadow-sm">
          <Zap :size="16" />
          <span class="hidden sm:inline">Speed</span>
          <span class="sm:hidden">Panker</span>
        </TabsTrigger>
        <TabsTrigger value="consistency" class="gap-2 py-2.5 data-[state=active]:shadow-sm">
          <Activity :size="16" />
          <span class="hidden sm:inline">Consistency</span>
          <span class="sm:hidden">Janker</span>
        </TabsTrigger>
        <TabsTrigger value="endurance" class="gap-2 py-2.5 data-[state=active]:shadow-sm">
          <Battery :size="16" />
          <span class="hidden sm:inline">Endurance</span>
          <span class="sm:hidden">Hanker</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="accuracy" class="mt-4">
        <TiankerMetrics :results="results" />
      </TabsContent>

      <TabsContent value="speed" class="mt-4">
        <PankerMetrics :results="results" />
      </TabsContent>

      <TabsContent value="consistency" class="mt-4">
        <ConsistencyMetrics v-if="results.consistency" :consistency="results.consistency" />

        <Card v-else class="p-6">
          <div class="flex flex-col items-center justify-center text-center space-y-4">
            <Activity :size="48" class="text-muted-foreground opacity-50" />
            <div>
              <h3 class="text-lg font-semibold mb-2">Consistency Metrics Unavailable</h3>
              <p class="text-sm text-muted-foreground">
                Consistency (Janker) metrics measure performance stability across multiple grids.
              </p>
              <p class="text-sm text-muted-foreground">
                This test only completed {{ results.grids.filter((g) => g.totalAnswered > 0).length }} grid {{ results.grids.filter((g) => g.totalAnswered > 0).length === 1 ? '' : 's' }} with answers.
              </p>
              <p class="text-sm text-muted-foreground mt-2">
                <strong>Requirement not met:</strong> Complete at least <strong>2 grids</strong> with answers to see consistency analysis.
              </p>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="endurance" class="mt-4">
        <EnduranceMetrics v-if="results.endurance" :endurance="results.endurance" />

        <Card v-else class="p-6">
          <div class="flex flex-col items-center justify-center text-center space-y-4">
            <Battery :size="48" class="text-muted-foreground opacity-50" />
            <div>
              <h3 class="text-lg font-semibold mb-2">Endurance Metrics Unavailable</h3>
              <p class="text-sm text-muted-foreground">
                Endurance (Hanker) metrics measure performance sustainability and fatigue patterns over time.
              </p>
              <p class="text-sm text-muted-foreground">
                This test did not complete any grids with answers.
              </p>
              <p class="text-sm text-muted-foreground mt-2">
                <strong>Requirement not met:</strong> Complete at least <strong>1 grid</strong> with
                answers to see endurance analysis.
              </p>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
