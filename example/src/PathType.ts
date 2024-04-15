export const pathTypes = ['linear', 'spline', 'linearWithAngle', 'splineWithAngle'] as const
export type PathType = (typeof pathTypes)[number]
