export enum TrendDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE',
}

export interface TrendData {
  direction: TrendDirection
  delta: number
}

export interface PeriodTrends {
  accuracy: TrendData
  apm: TrendData
}
