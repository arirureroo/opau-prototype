<script setup lang="ts">
import { computed } from 'vue'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Zap,
  Activity,
  Battery,
  Sparkles,
  Trophy,
  AlertTriangle,
  ArrowRight,
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { PerformanceStats } from '@/composables/performance'
import {
  interpretAccuracy,
  interpretSpeed,
  interpretConsistencyCV,
} from '@/domain/pauli/interpretations/PauliInterpreter'
import { PerformanceLevel, type PerformanceLevelType } from '@/types/pauli.types'

interface Props {
  stats: PerformanceStats
}

const props = defineProps<Props>()

// Calculate overall performance score (0-100)
const overallScore = computed(() => {
  if (props.stats.totalTests === 0) return 0

  // Weight: Accuracy 40%, Speed 25%, Consistency 20%, Endurance 15%
  const accuracyScore = Math.min(props.stats.avgAccuracy, 100)
  const speedScore = Math.min((props.stats.avgAPM / 45) * 100, 100) // 45 APM = 100%
  const consistencyScore = Math.max(0, 100 - props.stats.avgConsistency * 5) // Lower CV is better
  const enduranceScore = Math.max(0, 100 - Math.abs(props.stats.avgEndurance) * 3)

  return Math.round(
    accuracyScore * 0.4 +
    speedScore * 0.25 +
    consistencyScore * 0.2 +
    enduranceScore * 0.15
  )
})

const scoreLevel = computed(() => {
  if (overallScore.value >= 85) return { label: 'Excellent', color: 'emerald' }
  if (overallScore.value >= 70) return { label: 'Good', color: 'blue' }
  if (overallScore.value >= 55) return { label: 'Moderate', color: 'amber' }
  return { label: 'Developing', color: 'rose' }
})

// Metric analysis
interface MetricAnalysis {
  name: string
  description: string
  icon: typeof Target
  value: string
  unit?: string
  level: PerformanceLevelType
  trend: 'up' | 'down' | 'stable'
  trendValue?: string
  suggestion: string
}

const metricAnalysis = computed<MetricAnalysis[]>(() => {
  if (props.stats.totalTests === 0) return []

  const analysis: MetricAnalysis[] = []

  // Accuracy analysis
  const accuracyLevel = interpretAccuracy(props.stats.avgAccuracy)
  const accuracyTrend = props.stats.recentImprovement.accuracy
  analysis.push({
    name: 'Accuracy',
    description: 'Percentage of correct answers',
    icon: Target,
    value: props.stats.avgAccuracy.toFixed(1),
    unit: '%',
    level: accuracyLevel,
    trend: accuracyTrend > 1 ? 'up' : accuracyTrend < -1 ? 'down' : 'stable',
    trendValue: Math.abs(accuracyTrend) >= 0.1 ? `${accuracyTrend > 0 ? '+' : ''}${accuracyTrend.toFixed(1)}%` : undefined,
    suggestion: accuracyLevel === PerformanceLevel.EXCELLENT
      ? 'Outstanding precision! Consider pushing your speed a bit'
      : accuracyLevel === PerformanceLevel.GOOD
        ? 'Great accuracy! Small focus tweaks can push you higher'
        : accuracyLevel === PerformanceLevel.MODERATE
          ? 'Double-check calculations before moving on'
          : 'Focus on reducing errors over speed',
  })

  // Speed analysis
  const speedLevel = interpretSpeed(props.stats.avgAPM)
  const speedTrend = props.stats.recentImprovement.apm
  analysis.push({
    name: 'Speed',
    description: 'APM = Additions Per Minute',
    icon: Zap,
    value: props.stats.avgAPM.toFixed(1),
    unit: 'APM',
    level: speedLevel,
    trend: speedTrend > 1 ? 'up' : speedTrend < -1 ? 'down' : 'stable',
    trendValue: Math.abs(speedTrend) >= 0.1 ? `${speedTrend > 0 ? '+' : ''}${speedTrend.toFixed(1)}` : undefined,
    suggestion: speedLevel === PerformanceLevel.EXCELLENT
      ? 'Impressive speed! Maintain accuracy at this pace'
      : speedLevel === PerformanceLevel.GOOD
        ? 'Solid tempo! Regular practice will push you further'
        : speedLevel === PerformanceLevel.MODERATE
          ? 'Try warm-up exercises before tests'
          : 'Practice mental math to improve reaction time',
  })

  // Consistency analysis
  if (props.stats.avgConsistency > 0) {
    const consistencyLevel = interpretConsistencyCV(props.stats.avgConsistency)
    analysis.push({
      name: 'Consistency',
      description: 'CV = Coefficient of Variation (lower is better)',
      icon: Activity,
      value: props.stats.avgConsistency.toFixed(1),
      unit: '% CV',
      level: consistencyLevel,
      trend: 'stable',
      suggestion: consistencyLevel === PerformanceLevel.EXCELLENT
        ? 'Rock-solid stability! Your focus is exceptional'
        : consistencyLevel === PerformanceLevel.GOOD
          ? 'Stable performance! Keep your rhythm steady'
          : consistencyLevel === PerformanceLevel.MODERATE
            ? 'Try to keep a consistent rhythm'
            : 'Maintain steady focus throughout the test',
    })
  }

  // Endurance analysis
  if (props.stats.avgEndurance !== 0) {
    const enduranceLevel = Math.abs(props.stats.avgEndurance) < 5
      ? PerformanceLevel.EXCELLENT
      : Math.abs(props.stats.avgEndurance) < 10
        ? PerformanceLevel.GOOD
        : Math.abs(props.stats.avgEndurance) < 15
          ? PerformanceLevel.MODERATE
          : PerformanceLevel.POOR
    analysis.push({
      name: 'Endurance',
      description: 'Performance change from start to end',
      icon: Battery,
      value: `${props.stats.avgEndurance > 0 ? '-' : '+'}${Math.abs(props.stats.avgEndurance).toFixed(1)}`,
      unit: '%',
      level: enduranceLevel,
      trend: props.stats.avgEndurance > 5 ? 'down' : props.stats.avgEndurance < -5 ? 'up' : 'stable',
      suggestion: enduranceLevel === PerformanceLevel.EXCELLENT
        ? 'No fatigue detected! Great mental stamina'
        : enduranceLevel === PerformanceLevel.GOOD
          ? 'Good endurance! Stay hydrated and rested'
          : enduranceLevel === PerformanceLevel.MODERATE
            ? 'Build stamina with longer practice sessions'
            : 'Take brief mental pauses between grids',
    })
  }

  return analysis
})

// Key insights
interface KeyInsight {
  type: 'strength' | 'weakness' | 'opportunity'
  title: string
  description: string
}

const keyInsights = computed<KeyInsight[]>(() => {
  const insights: KeyInsight[] = []
  if (props.stats.totalTests < 2) return insights

  const accuracyLevel = interpretAccuracy(props.stats.avgAccuracy)
  const speedLevel = interpretSpeed(props.stats.avgAPM)

  // Strengths
  if (accuracyLevel === PerformanceLevel.EXCELLENT) {
    insights.push({
      type: 'strength',
      title: 'Precision Master',
      description: 'Your accuracy is exceptional. You make very few errors under pressure.',
    })
  }
  if (speedLevel === PerformanceLevel.EXCELLENT) {
    insights.push({
      type: 'strength',
      title: 'Speed Demon',
      description: 'Your processing speed is impressive, well above average performance.',
    })
  }
  if (props.stats.avgConsistency < 5 && props.stats.avgConsistency > 0) {
    insights.push({
      type: 'strength',
      title: 'Rock Steady',
      description: 'Your performance is remarkably stable across different test segments.',
    })
  }

  // Weaknesses
  if (accuracyLevel === PerformanceLevel.POOR) {
    insights.push({
      type: 'weakness',
      title: 'Accuracy Needs Work',
      description: 'Consider slowing down to improve accuracy. Quality matters more than quantity.',
    })
  }
  if (speedLevel === PerformanceLevel.POOR) {
    insights.push({
      type: 'weakness',
      title: 'Speed Development',
      description: 'Regular practice can help improve your processing speed over time.',
    })
  }
  if (props.stats.avgEndurance > 15) {
    insights.push({
      type: 'weakness',
      title: 'Fatigue Factor',
      description: 'Performance drops significantly during longer tests. Build mental stamina.',
    })
  }

  // Opportunities
  if (props.stats.recentImprovement.accuracy > 3 || props.stats.recentImprovement.apm > 3) {
    insights.push({
      type: 'opportunity',
      title: 'On the Rise',
      description: 'Your recent performance shows clear improvement. Keep up the momentum!',
    })
  }
  if (accuracyLevel === PerformanceLevel.EXCELLENT && speedLevel !== PerformanceLevel.EXCELLENT) {
    insights.push({
      type: 'opportunity',
      title: 'Speed Potential',
      description: 'With your accuracy, you can afford to push for faster responses.',
    })
  }
  if (speedLevel === PerformanceLevel.EXCELLENT && accuracyLevel !== PerformanceLevel.EXCELLENT) {
    insights.push({
      type: 'opportunity',
      title: 'Accuracy Boost',
      description: 'Slight slowdown could significantly improve your accuracy scores.',
    })
  }

  // Mode comparison opportunity
  const rankedBetter = props.stats.rankedStats.avgAccuracy > props.stats.practiceStats.avgAccuracy + 5
  const practiceBetter = props.stats.practiceStats.avgAccuracy > props.stats.rankedStats.avgAccuracy + 5
  if (rankedBetter && props.stats.practiceStats.totalTests > 0) {
    insights.push({
      type: 'opportunity',
      title: 'Competitive Edge',
      description: 'You perform better in ranked mode. The pressure brings out your best!',
    })
  } else if (practiceBetter && props.stats.rankedStats.totalTests > 0) {
    insights.push({
      type: 'opportunity',
      title: 'Relaxation Helps',
      description: 'You do better in practice. Try relaxation techniques for ranked tests.',
    })
  }

  return insights.slice(0, 3)
})

const getLevelColor = (level: PerformanceLevelType) => {
  switch (level) {
    case PerformanceLevel.EXCELLENT: return 'text-emerald-600 dark:text-emerald-400'
    case PerformanceLevel.GOOD: return 'text-blue-600 dark:text-blue-400'
    case PerformanceLevel.MODERATE: return 'text-amber-600 dark:text-amber-400'
    case PerformanceLevel.POOR: return 'text-rose-600 dark:text-rose-400'
  }
}

const getLevelBadgeVariant = (level: PerformanceLevelType) => {
  switch (level) {
    case PerformanceLevel.EXCELLENT: return 'default'
    case PerformanceLevel.GOOD: return 'secondary'
    case PerformanceLevel.MODERATE: return 'outline'
    case PerformanceLevel.POOR: return 'destructive'
  }
}

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up': return TrendingUp
    case 'down': return TrendingDown
    case 'stable': return Minus
  }
}

const getInsightIcon = (type: KeyInsight['type']) => {
  switch (type) {
    case 'strength': return Trophy
    case 'weakness': return AlertTriangle
    case 'opportunity': return ArrowRight
  }
}

const getInsightColors = (type: KeyInsight['type']) => {
  switch (type) {
    case 'strength': return {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-600 dark:text-emerald-400',
    }
    case 'weakness': return {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      icon: 'text-rose-600 dark:text-rose-400',
    }
    case 'opportunity': return {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: 'text-blue-600 dark:text-blue-400',
    }
  }
}
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <div>
        <h4 class="text-base sm:text-lg font-semibold">Performance Insights</h4>
        <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Analysis and recommendations based on your test history
        </p>
      </div>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- Empty State -->
      <div v-if="stats.totalTests === 0" class="text-center py-12 text-muted-foreground">
        <Sparkles :size="40" class="mx-auto mb-3 opacity-40" />
        <p class="text-sm">No insights yet</p>
        <p class="text-xs mt-1">Complete some tests to get personalized analysis</p>
      </div>

      <template v-else>
        <!-- Overall Score Section -->
        <div class="p-4 rounded-xl bg-muted/30 border border-border/50">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-xs text-muted-foreground uppercase tracking-wide font-medium">Overall Performance</p>
              <div class="flex items-baseline gap-2 mt-1">
                <span class="text-3xl font-bold tabular-nums">{{ overallScore }}</span>
                <span class="text-sm text-muted-foreground">/ 100</span>
              </div>
            </div>
            <Badge
              :variant="scoreLevel.color === 'emerald' ? 'default' : scoreLevel.color === 'rose' ? 'destructive' : 'secondary'"
              class="text-xs"
            >
              {{ scoreLevel.label }}
            </Badge>
          </div>
          <Progress :model-value="overallScore" class="h-2" />
          <p class="text-xs text-muted-foreground mt-2">
            Based on accuracy, speed, consistency, and endurance metrics
          </p>
        </div>

        <!-- Metrics Breakdown -->
        <div class="space-y-3">
          <h5 class="text-sm font-medium text-muted-foreground">Metrics Breakdown</h5>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="metric in metricAnalysis"
              :key="metric.name"
              class="group p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200"
            >
              <!-- Header -->
              <div class="flex items-center gap-2 mb-1">
                <div class="p-2 rounded-lg bg-muted/50">
                  <component :is="metric.icon" :size="18" class="text-muted-foreground" />
                </div>
                <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {{ metric.name }}
                </span>
              </div>

              <!-- Description -->
              <p class="text-2xs text-muted-foreground mb-3">{{ metric.description }}</p>

              <!-- Value -->
              <div class="flex items-baseline gap-1">
                <p :class="['text-3xl font-bold tabular-nums tracking-tight', getLevelColor(metric.level)]">
                  {{ metric.value }}
                </p>
                <span v-if="metric.unit" class="text-sm text-muted-foreground">{{ metric.unit }}</span>
              </div>

              <!-- Trend + Level -->
              <div class="flex items-center gap-2 mt-1">
                <Badge
                  :variant="getLevelBadgeVariant(metric.level)"
                  class="text-2xs capitalize"
                >
                  {{ metric.level }}
                </Badge>
                <div
                  v-if="metric.trendValue"
                  class="flex items-center gap-0.5 text-xs"
                  :class="{
                    'text-emerald-600 dark:text-emerald-400': metric.trend === 'up',
                    'text-rose-600 dark:text-rose-400': metric.trend === 'down',
                    'text-muted-foreground': metric.trend === 'stable',
                  }"
                >
                  <component :is="getTrendIcon(metric.trend)" :size="14" />
                  <span>{{ metric.trendValue }}</span>
                </div>
              </div>

              <!-- Suggestion -->
              <p class="text-xs text-muted-foreground mt-3 leading-relaxed">
                {{ metric.suggestion }}
              </p>
            </div>
          </div>
        </div>

        <!-- Key Insights -->
        <div v-if="keyInsights.length > 0" class="space-y-3">
          <h5 class="text-sm font-medium text-muted-foreground">Key Insights</h5>
          <div class="space-y-2">
            <div
              v-for="(insight, index) in keyInsights"
              :key="index"
              class="p-3 rounded-lg border transition-colors"
              :class="[getInsightColors(insight.type).bg, getInsightColors(insight.type).border]"
            >
              <div class="flex gap-3">
                <component
                  :is="getInsightIcon(insight.type)"
                  :size="16"
                  :class="['shrink-0 mt-0.5', getInsightColors(insight.type).icon]"
                />
                <div class="min-w-0">
                  <p class="text-sm font-medium">{{ insight.title }}</p>
                  <p class="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {{ insight.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Low Test Count Notice -->
        <div v-if="stats.totalTests < 5" class="p-3 rounded-lg bg-muted/30 border border-border/50">
          <div class="flex gap-2">
            <Sparkles :size="16" class="text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium">More data needed</p>
              <p class="text-xs text-muted-foreground mt-0.5">
                Complete {{ 5 - stats.totalTests }} more test{{ 5 - stats.totalTests > 1 ? 's' : '' }} to unlock detailed trend analysis and personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
