# @sumisonic/find-point-on-path

FindPointOnPath is a TypeScript library that utilizes functional programming principles to compute points on linear and spline paths. This library depends on `fp-ts` and provides a high-level API to obtain precise coordinates and angles of points on paths defined either linearly or through splines.

## Installation

Since this library depends on `fp-ts`, execute the following command to install:

```bash
npm install @sumisonic/find-point-on-path fp-ts
```

## Usage

### Linear Path Functions

#### createFindPointOnLinearPath

Calculates a specific point on a linear path based on a provided parameter. The return type is `Option` from `fp-ts`.

```javascript
import { createFindPointOnLinearPath } from '@sumisonic/find-point-on-path';

const points = [
  { x: 0, y: 0 },
  { x: 10, y: 10 }
];
const findPointOnPath = createFindPointOnLinearPath({})(points);
const t = 0.5; // Parameter indicating position on the path (0 to 1)
const point = findPointOnPath(t);
console.log(point); // Option<{ x: 5, y: 5 }>
```

#### createFindPointOnLinearPathWithAngle

Calculates a specific point and its angle (in radians) on a linear path. The return type is `Option` from `fp-ts`.

```javascript
import { createFindPointOnLinearPathWithAngle } from '@sumisonic/find-point-on-path';

const points = [
  { x: 0, y: 0 },
  { x: 20, y: 20 }
];
const findPointOnPathWithAngle = createFindPointOnLinearPathWithAngle({})(points);
const t = 0.75; // Parameter indicating position on the path (0 to 1)
const result = findPointOnPathWithAngle(t);
console.log(result); // Option<{ x: 15, y: 15, angle: 0.7853981633974483 }>
```

### Spline Path Functions

#### createFindPointOnSplinePath

Calculates a specific point on a spline path. Configuration options such as `tension` and `segments` can be specified. The return type is `Option` from `fp-ts`.

```javascript
import { createFindPointOnSplinePath } from '@sumisonic/find-point-on-path';

const splinePath = [
  { x: 0, y: 0 },
  { x: 10, y: 10 },
  { x: 20, y: 0 },
  { x: 30, y: 10 }
];
const config = { tension: 1, segments: 50 }; // Optional: Default values are tension = 1, segments = 50
const findPointOnSplinePath = createFindPointOnSplinePath(config)(splinePath);
const t = 0.5; // Parameter indicating position on the path (0 to 1)
const point = findPointOnSplinePath(t);
console.log(point); // Option<{ x: 15.01822534367541, y: 4.972662105562641 }>
```

#### createFindPointOnSplinePathWithAngle

Calculates both the position and angle (in radians) of a specific point on a spline path. The return type is `Option` from `fp-ts`.

```javascript
import { createFindPointOnSplinePathWithAngle } from '@sumisonic/find-point-on-path';

const splinePath = [
  { x: 0, y: 0 },
  { x: 10, y: 20 },
  { x: 20, y: 0 },
  { x: 30, y: 20 }
];
const config = { tension: 1, segments: 50 };
const findPointOnSplinePathWithAngle = createFindPointOnSplinePathWithAngle(config)(splinePath);
const t = 0.25; // Parameter indicating position on the path (0 to 1)
const result = findPointOnSplinePathWithAngle(t);
console.log(result); // Option<{ x: 7.285636734391148, y: 17.3772069343958, angle: 1.0247884906548697 }>
```

### Common Configuration Options

- **Tension**: Adjusts how tightly the curve conforms to the control points. Lower values make the curve smoother, while higher values make it more linear. The default value is `1`.
- **Segments**: Specifies the number of subdivisions along the curve. A higher number of segments results in a smoother curve but increases computational cost. The default is `50`.

## License

The MIT License (MIT)


