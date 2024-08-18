import { PointPolar } from './geometry/point-polar.interface';
import { Point } from './geometry/point.intarface';
import { PolarDirection } from './polar-direction.type';
import { TimestampToNumberFunction } from './timestamp-to-number-function.type';

export interface SceneObjectOptions {
  color?: string;
  direction?: PolarDirection;
  origin: Point;
  speed: number | TimestampToNumberFunction;
  position: PointPolar;
}
