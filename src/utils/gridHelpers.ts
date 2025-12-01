import { gridLayoutConfig } from './testConfig'

const {
  CELL_WIDTH,
  CELL_HEIGHT,
  COLUMN_GAP,
  HORIZONTAL_PADDING,
  VERTICAL_PADDING,
  MIN_COLUMNS,
  MAX_COLUMNS,
  MIN_ROWS,
  MAX_ROWS,
} = gridLayoutConfig

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max))
}

export const isLastOrFirstRow = (cellIndex: number, rows: number): boolean => {
  const rowPosition = cellIndex % rows
  return rowPosition === rows - 1
}

export const calculateGridDimensions = (
  viewportWidth: number,
  viewportHeight: number,
): { rows: number; columns: number } => {
  const availableWidth = viewportWidth - HORIZONTAL_PADDING
  const availableHeight = viewportHeight - VERTICAL_PADDING

  const maxColumns = Math.floor((availableWidth + COLUMN_GAP) / (CELL_WIDTH + COLUMN_GAP))
  const maxRows = Math.floor(availableHeight / CELL_HEIGHT)

  return {
    columns: clamp(maxColumns, MIN_COLUMNS, MAX_COLUMNS),
    rows: clamp(maxRows, MIN_ROWS, MAX_ROWS),
  }
}
