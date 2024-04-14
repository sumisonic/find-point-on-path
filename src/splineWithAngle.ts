import { pipe } from 'fp-ts/function'
import * as R from 'fp-ts/Reader'

import { type PathCalculator, createFindPointOnPath } from './findPointOnPath';
import { PointWithAngle } from './extendedPoint'
import {
  type SplineControlPoint,
  calculateSplineLength,
  getSplinePathParams,
  calculateSplinePoint,
  SplineConfig,
} from './spline'

/**
 * スプライン設定に追加で角度の計算精度を含む型。
 * `anglePrecision`は角度計算のための`t`の増分を指定する。
 */
type SplineWithAngleConfig = SplineConfig & {
  anglePrecision?: number // 角度計算のための`t`の増分
}

/**
 * スプライン制御点とパラメータに基づき、スプライン曲線上の点とその角度を計算する。
 * 角度は点の現在位置と次の位置から計算される。
 * @param anglePrecision 角度計算の精度（デフォルトは0.01）
 * @param splineControlPoint スプライン曲線の制御点を含むオブジェクト
 * @param t 曲線上の点を決定するパラメータ（0から1の間）
 * @return 角度を含む計算された点
 */
export const calculateSplinePointWithAngle =
  (anglePrecision: number = 0.01) =>
  (splineControlPoint: SplineControlPoint, t: number): PointWithAngle => {
    const point = calculateSplinePoint(splineControlPoint, t)
    // 次のt値を決定: tが1の場合は少し手前を、それ以外は少し後ろを参照する
    const nextT = t >= 1 ? t - anglePrecision : t + anglePrecision
    const nextPoint = calculateSplinePoint(splineControlPoint, Math.min(nextT, 1))

    // 進行方向を表すベクトルのための点を選択
    const basePoint = t >= 1 ? nextPoint : point // tが1のときは前の点を基準にする
    const directionPoint = t >= 1 ? point : nextPoint // tが1のときは現在の点を方向の終点にする

    // ベクトルの方向から角度を計算
    const angle = Math.atan2(directionPoint.y - basePoint.y, directionPoint.x - basePoint.x)

    return { ...point, angle }
  }

/**
 * スプライン設定に基づき、スプラインパス上の点とその角度を見つける関数を生成する。
 * @return スプラインパス上の点と角度を計算する関数を生成する Reader。
 */
export const createFindPointOnSplinePathWithAngle = pipe(
  R.ask<SplineWithAngleConfig>(),
  R.map((config) => {
    const calculator: PathCalculator<SplineControlPoint, PointWithAngle> = {
      calculateLength: calculateSplineLength(config.segments),
      getPathParams: getSplinePathParams(config.tension),
      calculatePoint: calculateSplinePointWithAngle(config.anglePrecision),
    }
    return createFindPointOnPath(calculator)
  }),
)
