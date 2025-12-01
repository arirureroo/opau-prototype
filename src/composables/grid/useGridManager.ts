import { ref } from 'vue'
import { generateGrid } from '@/services/gridGenerator'
import { useTestStore } from '@/stores/test'

export const useGridManager = () => {
  const testStore = useTestStore()
  const allGrids = ref<number[][]>([])
  const currentGridIndex = ref(0)
  const inputValues = ref<Map<number, number>>(new Map())

  const createNewGrid = (rows: number, columns: number) => {
    const newGrid = generateGrid(rows, columns)
    allGrids.value.push(newGrid)

    const gridIndex = allGrids.value.length - 1
    testStore.initializeGrid(gridIndex, newGrid, rows, columns)

    return gridIndex
  }

  const updateAnswer = (cellIndex: number, value: number) => {
    testStore.setAnswer(currentGridIndex.value, cellIndex, value)
    inputValues.value.set(cellIndex, value)
  }

  const syncAnswersFromStore = (gridIndex: number) => {
    inputValues.value = new Map(testStore.getGridAnswers(gridIndex))
  }

  const resetGrids = () => {
    allGrids.value = []
    currentGridIndex.value = 0
    inputValues.value.clear()
  }

  return {
    allGrids,
    currentGridIndex,
    inputValues,
    createNewGrid,
    updateAnswer,
    syncAnswersFromStore,
    resetGrids
  }
}
