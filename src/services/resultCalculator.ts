import type { GridData, TestResult, Mode } from '@/types/test.types'
import { orchestrateTestCalculation } from '@/domain/pauli/PauliTestOrchestrator'

export const calculateTestResult = (
  grids: GridData[],
  startTime: number | null,
  endTime: number | null,
  allocatedTimeMs: number,
  testMode: Mode | undefined,
): TestResult => {
  return orchestrateTestCalculation(grids, startTime, endTime, allocatedTimeMs, testMode)
}
