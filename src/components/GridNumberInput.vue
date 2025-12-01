<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, watch } from 'vue'
import { useTestStore } from '@/stores/test'
import { useGridDimensions, useGridNavigation, useGridManager } from '@/composables/grid'
import { isLastOrFirstRow } from '@/utils/gridHelpers'
import { getGridInputClasses } from '@/lib/inputStyles'
import { validateSingleDigit, inputValueToNumber, numberToInputValue } from '@/utils/inputValidation'
import { NavigationDirection } from '@/types/navigation.types'

const INPUT_CLASSES = getGridInputClasses()

const testStore = useTestStore()
const gridManager = useGridManager()

const emit = defineEmits<{
  testCompleted: []
}>()

const { rows, columns, updateDimensions } = useGridDimensions()

const testData = computed(
  () => gridManager.allGrids.value[gridManager.currentGridIndex.value] || []
)

const currentGridRows = computed(() => {
  const gridData = testStore.grids[gridManager.currentGridIndex.value]
  return gridData?.rows || rows.value
})

const gridStyle = computed(() => ({
  gridTemplateRows: `repeat(${currentGridRows.value}, minmax(0, 1fr))`
}))

const generateNewGrid = () => {
  gridManager.createNewGrid(rows.value, columns.value)
}

const syncInputValues = (newIndex: number) => {
  gridManager.syncAnswersFromStore(newIndex)

  nextTick(() => {
    navigation.inputRefs.value.forEach((input, i) => {
      if (input) {
        const value = gridManager.inputValues.value.get(i)
        input.value = numberToInputValue(value)
      }
    })
  })
}

const handleTestComplete = () => {
  testStore.completeTest()
  emit('testCompleted')
}

const navigation = useGridNavigation({
  rows: currentGridRows,
  testData,
  currentGridIndex: gridManager.currentGridIndex,
  allGrids: gridManager.allGrids,
  onTestComplete: handleTestComplete,
  onGridChange: syncInputValues,
  onGenerateNewGrid: generateNewGrid
})

watch(gridManager.currentGridIndex, syncInputValues)

defineExpose({
  allGrids: gridManager.allGrids,
  currentGridIndex: gridManager.currentGridIndex,
  focusFirstInput: navigation.focusFirstInput
})

const setInputRef = (element: HTMLInputElement, cellIndex: number) => {
  if (!element) return

  navigation.setInputRef(element, cellIndex)
  const value = gridManager.inputValues.value.get(cellIndex)
  element.value = numberToInputValue(value)
}

const handleInputChange = (cellIndex: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const sanitized = validateSingleDigit(target.value)

  target.value = sanitized
  gridManager.updateAnswer(cellIndex, inputValueToNumber(sanitized))
}

const handleArrowKey = (event: KeyboardEvent, cellIndex: number, direction: NavigationDirection) => {
  event.preventDefault()
  navigation[direction === NavigationDirection.UP ? 'moveUp' : 'moveDown'](cellIndex)
}

const resetGrid = () => {
  gridManager.resetGrids()
  navigation.inputRefs.value = []
  generateNewGrid()
  nextTick(navigation.focusFirstInput)
}

const handleResize = () => {
  updateDimensions()
  resetGrid()
}

onBeforeMount(generateNewGrid)

onMounted(() => {
  navigation.focusFirstInput()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
<template>
  <div class="flex flex-col justify-center">
    <div class="hidden w-fit h-fit md:grid grid-flow-col gap-x-8" :style="gridStyle">
      <div
        v-for="(number, cellIndex) in testData"
        :key="cellIndex"
        class="flex flex-col justify-between text-center"
        :class="isLastOrFirstRow(cellIndex, currentGridRows) ? 'h-fit' : 'h-full'"
      >
        <p class="items-start w-3 text-sm font-medium">{{ number }}</p>
        <input
          v-if="!isLastOrFirstRow(cellIndex, currentGridRows)"
          :ref="(element) => setInputRef(element as HTMLInputElement, cellIndex)"
          type="number"
          min="0"
          max="9"
          :class="INPUT_CLASSES"
          style="-moz-appearance: textfield !important;"
          @input="handleInputChange(cellIndex, $event)"
          @keyup.1.2.3.4.5.6.7.8.9.0.enter="navigation.moveDown(cellIndex)"
          @keydown.arrow-up="handleArrowKey($event, cellIndex, NavigationDirection.UP)"
          @keydown.arrow-down="handleArrowKey($event, cellIndex, NavigationDirection.DOWN)"
          @keydown.arrow-left="navigation.moveLeft(cellIndex)"
          @keydown.arrow-right="navigation.moveRight(cellIndex)"
        />
      </div>
    </div>

    <div class="block md:hidden text-lg font-semibold text-muted-foreground">
      Only available in desktop view.
    </div>
  </div>
</template>
