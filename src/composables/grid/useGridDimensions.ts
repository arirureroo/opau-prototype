import { ref } from 'vue'
import { calculateGridDimensions } from '@/utils/gridHelpers'

export const useGridDimensions = () => {
  const dimensions = calculateGridDimensions(window.innerWidth, window.innerHeight)
  const rows = ref(dimensions.rows)
  const columns = ref(dimensions.columns)

  const updateDimensions = () => {
    const newDimensions = calculateGridDimensions(window.innerWidth, window.innerHeight)
    rows.value = newDimensions.rows
    columns.value = newDimensions.columns
  }

  return {
    rows,
    columns,
    updateDimensions
  }
}
