import { Mode } from '@/types/test.types'

export const getModeLabel = (mode: Mode): string => {
  return mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()
}
