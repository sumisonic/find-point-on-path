import { pipe } from 'fp-ts/function'
import * as R from 'fp-ts/Reader'

import { FindPointOnPathFunction, PathCalculator, createFindPointOnPath } from './findPointOnPath'
import { LinearConfig, LinearPoint, calculateLinearLength, calculateLinearPoint, getLinearPathParams } from './linear'
import { PointWithAngle } from './extendedPoint'

/**
 * 与えられた線分の特定の`t`値に基づき、直線上の点とその点の角度を計算する。
 * 角度は始点から終点への線の傾きから計算される。
 * @param linearPoint 線分を定義する始点と終点を含むオブジェクト
 * @param t 0から1までの値で、線分上の点の位置を決定
 * @returns 計算された点とその点の角度を含むオブジェクト
 */
export const calculateLinearPointWithAngle = ({ start, end }: LinearPoint, t: number): PointWithAngle => {
  const { x, y } = calculateLinearPoint({ start, end }, t)
  const angle = Math.atan2(end.y - start.y, end.x - start.x) // Y差分をX差分で割り、アークタンジェントを取る
  return { x, y, angle }
}

/**
 * 直線上の点を計算する設定を受け取り、直線上の特定の`t`に対応する点を見つける関数を生成する Reader。
 * @returns 直線上の点を計算する関数を生成する Reader。
 */
export const createFindPointOnLinearPathWithAngle: R.Reader<
  LinearConfig,
  FindPointOnPathFunction<PointWithAngle>
> = pipe(
  R.ask<LinearConfig>(),
  R.map((_config) => {
    const linearCalculator: PathCalculator<LinearPoint, PointWithAngle> = {
      calculateLength: calculateLinearLength,
      getPathParams: getLinearPathParams,
      calculatePoint: calculateLinearPointWithAngle,
    }
    return createFindPointOnPath(linearCalculator)
  }),
)
