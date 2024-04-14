import { ExtendedPoint } from './findPointOnPath'

/**
 * Point型を拡張して角度情報を追加する型。
 * 角度はラジアン単位で保持される。
 */
export type PointWithAngle = ExtendedPoint<{
  angle: number // 角度をラジアン単位で保持
}>
