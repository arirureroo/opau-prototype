export const testConfig = {
  DEFAULT_MODE: 'ranked' as const,
  DEFAULT_DURATION_MINUTES: 5,
  RANKED_MIN_MINUTES: 55,
  RANKED_MAX_MINUTES: 60,
} as const

export const gridLayoutConfig = {
  CELL_WIDTH: 76,
  CELL_HEIGHT: 50,
  COLUMN_GAP: 20,
  HORIZONTAL_PADDING: 50,
  VERTICAL_PADDING: 150,
  MIN_COLUMNS: 5,
  MAX_COLUMNS: 30,
  MIN_ROWS: 5,
  MAX_ROWS: 25,
} as const
