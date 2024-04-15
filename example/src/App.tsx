import { Box, VStack } from '@chakra-ui/react'
import {
  Point,
  createFindPointOnLinearPath,
  createFindPointOnLinearPathWithAngle,
  createFindPointOnSplinePath,
  createFindPointOnSplinePathWithAngle,
} from '@sumisonic/find-point-on-path'
import { match } from 'ts-pattern'
import * as O from 'fp-ts/Option'
import React from 'react'

import { PathType } from './PathType'
import Canvas from './Canvas'
import GenerateButton from './GenerateButton'
import RadioButton from './RadioButton'
import Slider from './Slider'

const CanvasWidth = 800
const CanvasHeight = 600

/**
 * 指定された範囲内でランダムな点を生成する。
 * @param count 生成する点の数
 * @param canvasWidth キャンバスの幅
 * @param canvasHeight キャンバスの高さ
 * @param padding 余白
 * @returns 生成されたランダムな点の配列
 */
export const generateRandomPoints = (
  count: number,
  canvasWidth: number,
  canvasHeight: number,
  padding = 30,
): Point[] => {
  return Array.from({ length: count }, () => ({
    x: padding + Math.random() * (canvasWidth - 2 * padding), // padding から canvasWidth - padding の範囲で点を生成
    y: padding + Math.random() * (canvasHeight - 2 * padding), // padding から canvasHeight - padding の範囲で点を生成
  }))
}

export default function App() {
  const [pathType, setPathType] = React.useState<PathType>('splineWithAngle')
  const [tValue, setTValue] = React.useState(0)
  const [points, setPoints] = React.useState(generateRandomPoints(10, CanvasWidth, CanvasHeight))

  const regeneratePoints = () => {
    setPoints(generateRandomPoints(10, CanvasWidth, CanvasHeight))
  }

  const handlePathTypeChange = (nextValue: string) => {
    if (
      nextValue === 'linear' ||
      nextValue === 'spline' ||
      nextValue === 'linearWithAngle' ||
      nextValue === 'splineWithAngle'
    ) {
      setPathType(nextValue)
    }
  }

  const findPointOnPath = React.useMemo(() => {
    return match(pathType)
      .with('linear', () => createFindPointOnLinearPath({})(points))
      .with('spline', () => createFindPointOnSplinePath({})(points))
      .with('linearWithAngle', () => createFindPointOnLinearPathWithAngle({})(points))
      .with('splineWithAngle', () => createFindPointOnSplinePathWithAngle({})(points))
      .exhaustive()
  }, [pathType, points])

  const point = React.useMemo(() => {
    return findPointOnPath(tValue)
  }, [tValue, findPointOnPath])

  return (
    <Box p={5}>
      <VStack align="stretch" spacing={5} mb={10} w={CanvasWidth + 20}>
        <RadioButton onChange={handlePathTypeChange} value={pathType} />
        <Slider value={tValue} onChange={(val) => setTValue(val)} />
        <GenerateButton onClick={regeneratePoints} />
      </VStack>
      {O.isSome(point) && (
        <Canvas
          flexGrow="1"
          pathType={pathType}
          points={points}
          point={point.value}
          size={{ width: CanvasWidth, height: CanvasHeight }}
        />
      )}
    </Box>
  )
}
