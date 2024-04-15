import { Box, BoxProps, Center } from '@chakra-ui/react'
import * as React from 'react'

import { ExtendedPoint, Point, getLinearPathParams, getSplinePathParams } from '@sumisonic/find-point-on-path'
import { PathType } from './PathType'

// angleプロパティを持つかどうかをチェックする型ガード
// 型ガードを更新
const hasAngle = (point: unknown): point is ExtendedPoint<{ angle: number }> => {
  return (
    typeof point === 'object' &&
    point !== null &&
    'angle' in point &&
    typeof (point as { angle: unknown }).angle === 'number'
  )
}

export type CanvasProps<T> = BoxProps & {
  pathType: PathType
  points: Point[]
  point: ExtendedPoint<T> // ジェネリクスを使用して拡張
  size: {
    width: number
    height: number
  }
}

// ジェネリクス型 T を使用してコンポーネントを定義
const Canvas = <T extends {}>({ pathType, points, point, size, ...others }: CanvasProps<T>) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, size.width, size.height)
        ctx.fillStyle = '#000000'
        points.forEach((p, index) => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI)
          ctx.fill()
          ctx.font = '16px Arial'
          ctx.fillText(`#${index + 1}`, p.x + 8, p.y + 6)
        })

        if (pathType === 'spline' || pathType === 'splineWithAngle') {
          const splinePoints = getSplinePathParams(1)(points)
          ctx.strokeStyle = 'rgba(0,0,0,0.5)'
          splinePoints.forEach(({ p1, cp1, cp2, p2 }) => {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y)
            ctx.stroke()
          })
        }

        if (pathType === 'linear' || pathType === 'linearWithAngle') {
          const linearPoints = getLinearPathParams(points)
          ctx.strokeStyle = 'rgba(0,0,0,0.5)'
          linearPoints.forEach(({ start, end }) => {
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
          })
        }

        const triangleHeight = 20 // 三角形の高さ
        const triangleBase = (triangleHeight * Math.sqrt(3)) / 2 // 三角形の底辺の長さ（正三角形の場合）

        ctx.fillStyle = '#ff0000'
        ctx.beginPath()
        if (hasAngle(point)) {
          ctx.save() // 現在のコンテキストの状態を保存
          ctx.translate(point.x, point.y) // 三角形の中心を描画の中心に移動
          ctx.rotate(point.angle) // 三角形を指定された角度で回転

          // 三角形を右向きに描画（ベクトルが水平右向きを基準とする）
          ctx.moveTo(triangleHeight / 2, 0) // 右の頂点
          ctx.lineTo(-triangleHeight / 2, triangleBase / 2) // 下の頂点
          ctx.lineTo(-triangleHeight / 2, -triangleBase / 2) // 上の頂点
          ctx.closePath() // パスを閉じる

          ctx.restore() // コンテキストの状態を元に戻す
        } else {
          // 角度が指定されていない場合、単に三角形を描画（基準点を中心に右向き）
          ctx.moveTo(point.x + triangleHeight / 2, point.y)
          ctx.lineTo(point.x - triangleHeight / 2, point.y + triangleBase / 2)
          ctx.lineTo(point.x - triangleHeight / 2, point.y - triangleBase / 2)
          ctx.closePath()
        }
        ctx.fill()
      }
    }
  }, [points, point, pathType, size])

  return (
    <Box {...others}>
      <Center
        border="solid 2px #000000"
        borderRadius="5px"
        flexGrow={1}
        w={`${size.width + 10}px`}
        h={`${size.height + 10}px`}
      >
        <canvas ref={canvasRef} width={size.width} height={size.height} />
      </Center>
    </Box>
  )
}

export default Canvas
