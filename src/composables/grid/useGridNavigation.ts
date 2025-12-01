import { ref, nextTick, type Ref } from 'vue'
import { isLastOrFirstRow } from '@/utils/gridHelpers'

export interface UseGridNavigationOptions {
  rows: Ref<number>
  testData: Ref<number[]>
  currentGridIndex: Ref<number>
  allGrids: Ref<number[][]>
  onTestComplete?: () => void
  onGridChange: (newIndex: number) => void
  onGenerateNewGrid: () => void
}

export const useGridNavigation = (options: UseGridNavigationOptions) => {
  const { rows, testData, currentGridIndex, allGrids, onGridChange, onGenerateNewGrid } = options

  const inputRefs = ref<HTMLInputElement[]>([])

  const setInputRef = (element: HTMLInputElement, index: number) => {
    if (element) {
      inputRefs.value[index] = element
    }
  }

  const getFirstAnswerableIndex = () => (isLastOrFirstRow(0, rows.value) ? 1 : 0)

  const skipIfUnanswerable = (index: number): number => {
    return isLastOrFirstRow(index, rows.value) ? index - 1 : index
  }

  const focusInput = (index: number) => {
    nextTick(() => {
      inputRefs.value[index]?.focus()
    })
  }

  const navigateToNextGrid = (getTargetIndex: () => number) => {
    if (currentGridIndex.value >= allGrids.value.length - 1) {
      onGenerateNewGrid()
    }

    currentGridIndex.value++
    onGridChange(currentGridIndex.value)
    focusInput(getTargetIndex())
  }

  const moveUp = (currentIndex: number) => {
    const previous = skipIfUnanswerable(currentIndex - 1)
    if (previous >= 0) {
      focusInput(previous)
    }
  }

  const moveDown = (currentIndex: number) => {
    let next = currentIndex + 1
    next = isLastOrFirstRow(next, rows.value) ? next + 1 : next

    if (next < testData.value.length) {
      focusInput(next)
    } else {
      navigateToNextGrid(getFirstAnswerableIndex)
    }
  }

  const moveRight = (currentIndex: number) => {
    const right = currentIndex + rows.value

    if (right < testData.value.length) {
      focusInput(right)
    } else {
      navigateToNextGrid(() => {
        const targetIndex = currentIndex % rows.value
        return isLastOrFirstRow(targetIndex, rows.value) ? 1 : targetIndex
      })
    }
  }

  const moveLeft = (currentIndex: number) => {
    const left = currentIndex - rows.value
    if (left >= 0) {
      focusInput(left)
    }
  }

  const focusFirstInput = () => {
    focusInput(getFirstAnswerableIndex())
  }

  return {
    inputRefs,
    setInputRef,
    moveUp,
    moveDown,
    moveRight,
    moveLeft,
    focusFirstInput,
  }
}
