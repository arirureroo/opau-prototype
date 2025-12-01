import { gridLayoutConfig } from '@/utils/testConfig'

const MIN_DIGIT = 1
const MAX_DIGIT = 9

const generateRandomDigit = (): number => {
  return Math.floor(Math.random() * MAX_DIGIT) + MIN_DIGIT
}

const validateGridDimensions = (rows: number, columns: number): void => {
  const { MIN_ROWS, MAX_ROWS, MIN_COLUMNS, MAX_COLUMNS } = gridLayoutConfig

  if (!Number.isInteger(rows) || rows < MIN_ROWS || rows > MAX_ROWS) {
    throw new Error(`Invalid rows: ${rows}. Must be an integer between ${MIN_ROWS} and ${MAX_ROWS}`)
  }
  if (!Number.isInteger(columns) || columns < MIN_COLUMNS || columns > MAX_COLUMNS) {
    throw new Error(
      `Invalid columns: ${columns}. Must be an integer between ${MIN_COLUMNS} and ${MAX_COLUMNS}`,
    )
  }
}

export const generateGrid = (rows: number, columns: number): number[] => {
  validateGridDimensions(rows, columns)
  const totalCells = rows * columns
  return Array.from({ length: totalCells }, generateRandomDigit)
}
