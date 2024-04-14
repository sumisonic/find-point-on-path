import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as R from 'fp-ts/Reader'

import { type PathCalculator, type Point, calculateDistance, createFindPointOnPath } from './findPointOnPath'

export type SplineControlPoint = {
  p1: Point // 始点
  p2: Point // 終点
  cp1: Point // 制御点1
  cp2: Point // 制御点2
}

/**
 * スプライン制御点を使用してスプライン曲線の長さを近似的に計算する。
 * @param segments 曲線を近似するために使用する線分の数
 * @return 曲線の近似長
 */
export const calculateSplineLength =
  (segments: number = 50) =>
  (splineControlPoint: SplineControlPoint): number =>
    pipe(
      A.makeBy(segments, (i) => i / segments),
      A.map((t) => calculateSplinePoint(splineControlPoint, t)),
      A.chainWithIndex((i, point) =>
        i === 0
          ? []
          : [calculateDistance(point, calculateSplinePoint(splineControlPoint, i / segments - 1 / segments))],
      ),
      A.reduce(0, (acc, length) => acc + length),
    )

/**
 * 点の配列からスプライン曲線の制御点を計算する。
 * @param points スプライン曲線を形成するための点の配列
 * @param tension 曲線のテンションを調整するパラメータ。デフォルトは1。
 * @return 各セグメントのスプライン制御点を含むオブジェクトの配列
 */
export const getSplinePathParams =
  (tension: number = 1) =>
  (points: Point[]): SplineControlPoint[] => {
    // 点が2つ未満の場合、空の配列を返す
    if (points.length < 2) return []

    // 点が1つの場合でも、スプライン曲線を描くために最初と最後に同じ点を追加して3点に増やす
    // これにより、少なくとも1点がある場合には常にスプライン曲線を描くことが可能になる
    const extendedPoints = [points[0], ...points, points[points.length - 1]]

    return extendedPoints.flatMap((currentPoint, i, arr) => {
      if (i === 0 || i >= arr.length - 2) return []

      const previousPoint = arr[i - 1]
      const nextPoint = arr[i + 1]
      const nextNextPoint = arr[i + 2] || nextPoint

      const controlPoint1X = currentPoint.x + ((nextPoint.x - previousPoint.x) / 6) * tension
      const controlPoint1Y = currentPoint.y + ((nextPoint.y - previousPoint.y) / 6) * tension
      const controlPoint2X = nextPoint.x - ((nextNextPoint.x - currentPoint.x) / 6) * tension
      const controlPoint2Y = nextPoint.y - ((nextNextPoint.y - currentPoint.y) / 6) * tension

      return [
        {
          p1: currentPoint,
          p2: nextPoint,
          cp1: { x: controlPoint1X, y: controlPoint1Y },
          cp2: { x: controlPoint2X, y: controlPoint2Y },
        },
      ]
    })
  }

/**
 * スプライン制御点とパラメータに基づきスプライン曲線上の点を計算する。
 * @param splineControlPoint スプライン曲線の制御点を含むオブジェクト
 * @param t 曲線上の点を決定するパラメータ（0から1の間）
 * @return 曲線上の点
 */
export const calculateSplinePoint = (splineControlPoint: SplineControlPoint, t: number): Point => {
  const { p1, cp1, cp2, p2 } = splineControlPoint
  const tSquared = t * t
  const tCubed = tSquared * t
  const inverseT = 1 - t
  const inverseTSquared = inverseT * inverseT
  const inverseTCubed = inverseTSquared * inverseT

  const x = inverseTCubed * p1.x + 3 * inverseTSquared * t * cp1.x + 3 * inverseT * tSquared * cp2.x + tCubed * p2.x
  const y = inverseTCubed * p1.y + 3 * inverseTSquared * t * cp1.y + 3 * inverseT * tSquared * cp2.y + tCubed * p2.y

  return { x, y }
}

export type SplineConfig = {
  tension?: number
  segments?: number
}

/**
 * スプライン設定に基づきスプラインパス上の点を見つける関数を生成する。
 * @return スプラインパス上の点を見つける関数
 */
export const createFindPointOnSplinePath = pipe(
  R.ask<SplineConfig>(),
  R.map((config) => {
    const calculator: PathCalculator<SplineControlPoint, {}> = {
      calculateLength: calculateSplineLength(config.segments),
      getPathParams: getSplinePathParams(config.tension),
      calculatePoint: calculateSplinePoint,
    }
    return createFindPointOnPath(calculator)
  }),
)
