import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as R from 'fp-ts/Reader'

import { type FindPointOnPathFunction, type PathCalculator, type Point, createFindPointOnPath } from './findPointOnPath'

export type LinearPoint = {
  start: Point
  end: Point
}

/**
 * 与えられた二点間の直線距離を計算する。
 * @param start 開始点
 * @param end 終了点
 * @returns 二点間の距離
 */
export const calculateLinearLength = ({ start, end }: LinearPoint): number =>
  Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2)

/**
 * 点の配列から直線のセグメントのパラメータを生成する。
 * @param points 点の配列
 * @returns 直線のセグメントのパラメータの配列
 */
export const getLinearPathParams = (points: Point[]): LinearPoint[] =>
  A.zipWith(points, points.slice(1), (a, b) => ({ start: a, end: b }))

/**
 * 与えられた線分の特定の`t`値に基づき、直線上の点を計算する。
 * @param linearPoint 線分を定義する始点と終点を含むオブジェクト
 * @param t 0から1までの値で、線分上の点の位置を決定
 * @returns 計算された点
 */
export const calculateLinearPoint = ({ start, end }: LinearPoint, t: number): Point => ({
  x: start.x + (end.x - start.x) * t,
  y: start.y + (end.y - start.y) * t,
})

export type LinearConfig = Record<string, never>

/**
 * 直線上の点を計算するための設定を受け取り、直線上の特定の`t`に対応する点を見つける関数を生成する Reader。
 * @returns Reader、これは直線上の点を計算する関数を生成する。
 */
export const createFindPointOnLinearPath: R.Reader<LinearConfig, FindPointOnPathFunction<{}>> = pipe(
  R.ask<LinearConfig>(),
  R.map((_config) => {
    const linearCalculator: PathCalculator<LinearPoint, {}> = {
      calculateLength: calculateLinearLength,
      getPathParams: getLinearPathParams,
      calculatePoint: calculateLinearPoint,
    }
    return createFindPointOnPath(linearCalculator)
  }),
)
