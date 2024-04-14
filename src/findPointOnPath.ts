import * as O from 'fp-ts/Option'

// 基本的な点の型定義
export type Point = {
  x: number
  y: number
}

/**
 * 点を拡張して追加データを含む型。
 * @template T - 追加されるデータの型。
 */
export type ExtendedPoint<T> = Point & T

/**
 * 与えられた二点間の距離を計算する。
 * @param a - 始点
 * @param b - 終点
 * @returns 二点間の距離
 */
export const calculateDistance = (a: Point, b: Point): number => Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)

/**
 * パス上の計算を行うための関数群を定義する型。
 * この型は、与えられた点の配列を基にパス（曲線や直線など）上の特定のポイントを見つけるために必要な計算を抽象化する。
 * @template PathParams パスの計算に必要なパラメータを格納する型。
 * @template ExtraPointData - 追加の点データの型
 */
export type PathCalculator<PathParams, ExtraPointData> = {
  /**
   * パスの特定のセグメントまたはパラメータに基づき距離を計算する。
   * @param params - 距離計算に使用するパスのパラメータ。
   * @returns 計算された距離の数値。
   */
  calculateLength: (params: PathParams) => number

  /**
   * 与えられた点の配列からパスの計算に必要なパラメータの配列を生成する。
   * @param points - パスを形成する点の配列。
   * @returns パスの各セグメントまたは部分に対応するパラメータの配列。
   */
  getPathParams: (points: Point[]) => PathParams[]

  /**
   * パスの特定のパラメータとパラメータ`t`に基づき、パス上の点を計算する。
   * @param params - ポイントを計算するためのパスのパラメータ。
   * @param t - パス上の特定の点を決定するためのパラメータ（通常は0から1の間）。
   * @returns パス上の計算された点。
   */
  calculatePoint: (params: PathParams, t: number) => ExtendedPoint<ExtraPointData>
}

/**
 * 与えられたポイントの配列とパス計算器を用いて、パス上の特定の`t`に対応するポイントを見つける関数を生成する。
 * @template ExtraPointData - 追加の点データの型
 * @returns ポイントの配列と`t`値を引数に取り、計算されたポイントを`Option`型で返す関数の型。
 */
export type FindPointOnPathFunction<ExtraPointData> = (
  points: Point[],
) => (t: number) => O.Option<ExtendedPoint<ExtraPointData>>

/**
 * `createFindPointOnPath`は、特定のパス計算ロジックに基づいてパス上の点を見つける関数を生成する。
 * @param calculator パス上のポイントを計算するための関数群を提供するオブジェクト。
 * @returns ポイントの配列を引数に取り、`t`値に基づいて計算されたポイントを`Option`型で返す関数。
 */
export const createFindPointOnPath = <PathParams, ExtraPointData>(
  calculator: PathCalculator<PathParams, ExtraPointData>,
): FindPointOnPathFunction<ExtraPointData> => {
  return (points: Point[]) => {
    const params = calculator.getPathParams(points)
    const distances = params.map((p) => calculator.calculateLength(p))
    const totalDistance = distances.reduce((acc, length) => acc + length, 0)

    return (t: number): O.Option<ExtendedPoint<ExtraPointData>> => {
      if (t < 0 || t > 1) {
        return O.none
      }

      const targetDistance = totalDistance * t
      const findPoint = (index: number, accumulatedDistance: number): O.Option<ExtendedPoint<ExtraPointData>> => {
        if (index >= points.length - 1) {
          return O.some(calculator.calculatePoint(params[index], 1))
        }

        const dist = distances[index]
        if (accumulatedDistance + dist >= targetDistance) {
          const ratio = (targetDistance - accumulatedDistance) / dist
          return O.some(calculator.calculatePoint(params[index], ratio))
        }

        return findPoint(index + 1, accumulatedDistance + dist)
      }

      return findPoint(0, 0)
    }
  }
}
