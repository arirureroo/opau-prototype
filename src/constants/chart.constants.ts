export const chartDimensions = {
  Y_AXIS_DIVISIONS: 5,
  X_AXIS_DIVISIONS: 5,
  HEIGHTS: {
    MOBILE: 160,
    TABLET: 200,
    DESKTOP: 240,
  },
} as const

export const chartStyles = {
  STROKE_WIDTH_DEFAULT: '2.5',
  STROKE_WIDTH_HOVERED: '3',
  HIT_AREA_RADIUS: 3,
  DOT_RADIUS: 2,
  DOT_RING_WIDTH: 2,
} as const

export const Y_AXIS_LABELS = [100, 75, 50, 25, 0]
